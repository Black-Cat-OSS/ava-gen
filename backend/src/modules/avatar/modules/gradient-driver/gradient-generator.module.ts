import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { AvatarObject, ColorScheme } from '../../../../common/interfaces/avatar-object.interface';
import { IGeneratorStrategy } from '../../../../common/interfaces/generator-strategy.interface';
import { PalettesService } from '../../../../modules/palettes';
import { convertNamedColorToHex } from '../../../../modules/palettes/utils/color-converter.util';
import { WorkerPoolService } from '../../utils/worker-pool.service';
import { GradientWorkerMessage } from '../../interfaces/worker-message.interface';
import { PerformanceMonitor } from '../../utils/performance-monitor.util';
import { AVATAR_SIZES } from '../../utils/avatar-sizes.util';
import { initializeColorSchemes, resolveColorScheme } from '../../utils/color-scheme.util';
import { createAvatarObject } from '../../utils/avatar-object.util';
import type { AvatarSizeKey } from '../../utils/avatar-sizes.util';

/**
 * Генератор градиентных аватаров
 *
 * Создает аватары с линейным градиентом от одного цвета к другому
 * с возможностью настройки угла поворота градиента.
 *
 * @class GradientGeneratorModule
 */
@Injectable()
export class GradientGeneratorModule implements IGeneratorStrategy {
  private readonly logger = new Logger(GradientGeneratorModule.name);

  private colorSchemes: ColorScheme[] = [];

  constructor(
    private readonly palettesService: PalettesService,
    private readonly workerPoolService?: WorkerPoolService,
  ) {
    this.initializeColorSchemes();
  }

  private async initializeColorSchemes(): Promise<void> {
    this.colorSchemes = await initializeColorSchemes(this.palettesService, this.logger);
  }

  async generateAvatar(
    primaryColor?: string,
    foreignColor?: string,
    colorScheme?: string,
    _seed?: string,
    angle?: number,
  ): Promise<AvatarObject> {
    this.logger.log('Generating new gradient avatar');

    const id = uuidv4();
    const now = new Date();
    const operationId = `gradient-${id}`;

    const activeWorkers = this.workerPoolService?.getActiveWorkersCount();
    const maxWorkers = this.workerPoolService?.getMaxWorkers();
    PerformanceMonitor.start(operationId, activeWorkers, maxWorkers);

    try {
      const { primaryColor: finalPrimaryColor, foreignColor: finalForeignColor } =
        resolveColorScheme(this.colorSchemes, colorScheme, primaryColor, foreignColor);

      let imageBuffers: Record<AvatarSizeKey, Buffer>;

      if (this.workerPoolService?.isEnabled()) {
        try {
          const tasks = AVATAR_SIZES.map(({ key, size }) => {
            const taskId = `${id}-${size}`;
            const message: GradientWorkerMessage = {
              type: 'gradient',
              taskId,
              size,
              primaryColor: finalPrimaryColor,
              foreignColor: finalForeignColor,
              angle,
            };
            return this.workerPoolService
              .executeTask(message, 'gradient-worker.js')
              .then(buffer => ({ key, buffer }));
          });

          const results = await Promise.all(tasks);
          imageBuffers = Object.fromEntries(results.map(r => [r.key, r.buffer])) as Record<
            AvatarSizeKey,
            Buffer
          >;
        } catch (error) {
          this.logger.warn(
            `Parallel generation failed, falling back to sequential: ${error.message}`,
          );
          imageBuffers = await this.generateSequentially(
            finalPrimaryColor,
            finalForeignColor,
            angle,
          );
        }
      } else {
        imageBuffers = await this.generateSequentially(finalPrimaryColor, finalForeignColor, angle);
      }

      const avatarObject = createAvatarObject(id, now, imageBuffers);

      const metrics = PerformanceMonitor.stop(
        operationId,
        this.workerPoolService?.getActiveWorkersCount(),
        this.workerPoolService?.getMaxWorkers(),
      );

      if (metrics) {
        this.logger.log(
          `Gradient avatar generated with ID: ${id} | ${PerformanceMonitor.formatMetrics(metrics)}`,
        );
      } else {
        this.logger.log(`Gradient avatar generated with ID: ${id}`);
      }

      return avatarObject;
    } catch (error) {
      PerformanceMonitor.stop(operationId);
      throw error;
    }
  }

  private async generateSequentially(
    primaryColor?: string,
    foreignColor?: string,
    angle?: number,
  ): Promise<Record<AvatarSizeKey, Buffer>> {
    const results: Record<AvatarSizeKey, Buffer> = {} as Record<AvatarSizeKey, Buffer>;
    for (const { key, size } of AVATAR_SIZES) {
      results[key] = await this.generateImageForSize(size, primaryColor, foreignColor, angle);
    }
    return results;
  }

  private async generateImageForSize(
    size: number,
    primaryColor?: string,
    foreignColor?: string,
    angle?: number,
  ): Promise<Buffer> {
    const canvas = Buffer.alloc(size * size * 4);

    // Use provided angle directly (gradient doesn't use random generation)
    const gradientAngle = angle !== undefined ? angle : 90; // Default to 90° if no angle provided

    const primaryRgb = this.hexToRgb(primaryColor || '#3B82F6');
    const foreignRgb = this.hexToRgb(foreignColor || '#60A5FA');

    // Convert angle to radians
    const angleRad = (gradientAngle * Math.PI) / 180;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const index = (y * size + x) * 4;

        // Normalize coordinates to [-1, 1]
        const nx = (x / (size - 1)) * 2 - 1;
        const ny = (y / (size - 1)) * 2 - 1;

        // Calculate position along gradient direction
        const t = (nx * Math.cos(angleRad) + ny * Math.sin(angleRad) + 1) / 2;
        const clampedT = Math.max(0, Math.min(1, t));

        // Interpolate between colors
        const r = Math.round(primaryRgb.r + (foreignRgb.r - primaryRgb.r) * clampedT);
        const g = Math.round(primaryRgb.g + (foreignRgb.g - primaryRgb.g) * clampedT);
        const b = Math.round(primaryRgb.b + (foreignRgb.b - primaryRgb.b) * clampedT);

        canvas[index] = r;
        canvas[index + 1] = g;
        canvas[index + 2] = b;
        canvas[index + 3] = 255;
      }
    }

    return await sharp(canvas, {
      raw: {
        width: size,
        height: size,
        channels: 4,
      },
    })
      .png()
      .toBuffer();
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    let convertedHex = convertNamedColorToHex(hex);

    // Remove # if present
    convertedHex = convertedHex.replace(/^#/, '');

    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    if (convertedHex.length === 3) {
      convertedHex = convertedHex
        .split('')
        .map(char => char + char)
        .join('');
    }

    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(convertedHex);

    if (!result) {
      // Default to blue if color is invalid
      return { r: 59, g: 130, b: 246 };
    }

    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    };
  }

  async getColorSchemes(): Promise<ColorScheme[]> {
    if (this.colorSchemes.length === 0) {
      await this.initializeColorSchemes();
    }
    return this.colorSchemes;
  }
}
