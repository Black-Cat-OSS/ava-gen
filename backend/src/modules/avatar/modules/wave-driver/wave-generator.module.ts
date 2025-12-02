import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { AvatarObject, ColorScheme } from '../../../../common/interfaces/avatar-object.interface';
import { IGeneratorStrategy } from '../../../../common/interfaces/generator-strategy.interface';
import { PalettesService } from '../../../../modules/palettes';
import { convertNamedColorToHex } from '../../../../modules/palettes/utils/color-converter.util';
import { WorkerPoolService } from '../../utils/worker-pool.service';
import { WaveWorkerMessage } from '../../interfaces/worker-message.interface';
import { PerformanceMonitor } from '../../utils/performance-monitor.util';
import { AVATAR_SIZES } from '../../utils/avatar-sizes.util';
import { initializeColorSchemes, resolveColorScheme } from '../../utils/color-scheme.util';
import { createAvatarObject } from '../../utils/avatar-object.util';
import type { AvatarSizeKey } from '../../utils/avatar-sizes.util';

@Injectable()
export class WaveGeneratorModule implements IGeneratorStrategy {
  private readonly logger = new Logger(WaveGeneratorModule.name);

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
    seed?: string,
    _angle?: number,
  ): Promise<AvatarObject> {
    this.logger.log('Generating new wave avatar');

    const id = uuidv4();
    const now = new Date();
    const operationId = `wave-${id}`;

    const activeWorkers = this.workerPoolService?.getActiveWorkersCount();
    const maxWorkers = this.workerPoolService?.getMaxWorkers();
    PerformanceMonitor.start(operationId, activeWorkers, maxWorkers);

    try {
      const { primaryColor: finalPrimaryColor, foreignColor: finalForeignColor } =
        resolveColorScheme(this.colorSchemes, colorScheme, primaryColor, foreignColor);

      const uniqueSeed = seed || uuidv4();

      let imageBuffers: Record<AvatarSizeKey, Buffer>;

      if (this.workerPoolService?.isEnabled()) {
        try {
          const tasks = AVATAR_SIZES.map(({ key, size }) => {
            const taskId = `${id}-${size}`;
            const message: WaveWorkerMessage = {
              type: 'wave',
              taskId,
              size,
              primaryColor: finalPrimaryColor,
              foreignColor: finalForeignColor,
              seed: uniqueSeed,
            };
            return this.workerPoolService
              .executeTask(message, 'wave-worker.js')
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
            uniqueSeed,
          );
        }
      } else {
        imageBuffers = await this.generateSequentially(
          finalPrimaryColor,
          finalForeignColor,
          uniqueSeed,
        );
      }

      const avatarObject = createAvatarObject(id, now, imageBuffers);

      const metrics = PerformanceMonitor.stop(
        operationId,
        this.workerPoolService?.getActiveWorkersCount(),
        this.workerPoolService?.getMaxWorkers(),
      );

      if (metrics) {
        this.logger.log(
          `Wave avatar generated with ID: ${id} | ${PerformanceMonitor.formatMetrics(metrics)}`,
        );
      } else {
        this.logger.log(`Wave avatar generated with ID: ${id}`);
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
    seed?: string,
  ): Promise<Record<AvatarSizeKey, Buffer>> {
    const results: Record<AvatarSizeKey, Buffer> = {} as Record<AvatarSizeKey, Buffer>;
    for (const { key, size } of AVATAR_SIZES) {
      results[key] = await this.generateImageForSize(size, primaryColor, foreignColor, seed);
    }
    return results;
  }

  private async generateImageForSize(
    size: number,
    primaryColor?: string,
    foreignColor?: string,
    seed?: string,
  ): Promise<Buffer> {
    const canvas = Buffer.alloc(size * size * 4);

    const randomSeed = seed ? this.seedToNumber(seed) : Math.random();
    const rng = this.createSeededRandom(randomSeed);

    // Generate wave parameters
    const frequency1 = 0.1 + rng() * 0.2; // 0.1 to 0.3
    const frequency2 = 0.15 + rng() * 0.25; // 0.15 to 0.4
    const amplitude1 = 0.3 + rng() * 0.4; // 0.3 to 0.7
    const amplitude2 = 0.2 + rng() * 0.3; // 0.2 to 0.5
    const phase1 = rng() * Math.PI * 2;
    const phase2 = rng() * Math.PI * 2;

    const primaryRgb = this.hexToRgb(primaryColor || '#3B82F6');
    const foreignRgb = this.hexToRgb(foreignColor || '#60A5FA');

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const index = (y * size + x) * 4;

        // Normalize coordinates to 0-1
        const nx = x / size;
        const ny = y / size;

        // Create wave pattern
        const wave1 = Math.sin(nx * frequency1 * Math.PI * 2 + phase1) * amplitude1;
        const wave2 = Math.sin(ny * frequency2 * Math.PI * 2 + phase2) * amplitude2;
        const combinedWave = (wave1 + wave2) / 2;

        // Create radial pattern
        const centerX = 0.5;
        const centerY = 0.5;
        const distance = Math.sqrt((nx - centerX) ** 2 + (ny - centerY) ** 2);
        const radialPattern = Math.sin(distance * Math.PI * 4) * 0.3;

        // Combine patterns
        const pattern = combinedWave + radialPattern;

        // Determine if pixel should be primary or foreign color
        const isPrimary = pattern > 0;

        const color = isPrimary ? primaryRgb : foreignRgb;

        canvas[index] = color.r;
        canvas[index + 1] = color.g;
        canvas[index + 2] = color.b;
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

  private createSeededRandom(seed: number): () => number {
    let value = seed;
    return () => {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  }

  private seedToNumber(seed: string): number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) / 2147483647; // Normalize to 0-1
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
