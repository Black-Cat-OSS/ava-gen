import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import Delaunator from 'delaunator';
import PoissonDiskSampling from 'poisson-disk-sampling';
import { AvatarObject, ColorScheme } from '../../../../common/interfaces/avatar-object.interface';
import { IGeneratorStrategy } from '../../../../common/interfaces/generator-strategy.interface';
import { PalettesService } from '../../../../modules/palettes';
import { EmojiService } from '../../../../modules/emoji';
import { convertNamedColorToHex } from '../../../../modules/palettes/utils/color-converter.util';
import { WorkerPoolService } from '../../utils/worker-pool.service';
import { LowpolyWorkerMessage } from '../../interfaces/worker-message.interface';
import { PerformanceMonitor } from '../../utils/performance-monitor.util';
import { AVATAR_SIZES } from '../../utils/avatar-sizes.util';
import { initializeColorSchemes, resolveColorScheme } from '../../utils/color-scheme.util';
import { createAvatarObject } from '../../utils/avatar-object.util';
import type { AvatarSizeKey } from '../../utils/avatar-sizes.util';

type Point = [number, number];

/**
 * Генератор lowpoly аватаров
 *
 * Создает аватары в low-poly стиле используя триангуляцию Делаунея
 * и распределение точек по методу Пуассона.
 *
 * Поддерживаемые параметры:
 * - pointDensity: плотность точек для триангуляции ('low' | 'medium' | 'high')
 * - colorVariation: вариация цветов в треугольниках (0-100)
 * - edgeDetection: использовать ли определение контуров (boolean)
 *
 * @class LowpolyGeneratorModule
 */
@Injectable()
export class LowpolyGeneratorModule implements IGeneratorStrategy {
  private readonly logger = new Logger(LowpolyGeneratorModule.name);

  private colorSchemes: ColorScheme[] = [];

  constructor(
    private readonly palettesService: PalettesService,
    private readonly emojiService: EmojiService,
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
    angle?: number,
    pointDensity: 'low' | 'medium' | 'high' = 'medium',
    colorVariation: number = 0,
    edgeDetection: boolean = true,
    emoji?: string,
    emojiSize: 'small' | 'medium' | 'large' = 'large',
    backgroundType: 'solid' | 'linear' | 'radial' = 'linear',
  ): Promise<AvatarObject> {
    this.logger.log(
      `Generating lowpoly avatar with density: ${pointDensity}, variation: ${colorVariation}, emoji: ${emoji || 'none'}`,
    );

    const id = uuidv4();
    const now = new Date();
    const operationId = `lowpoly-${id}`;

    const activeWorkers = this.workerPoolService?.getActiveWorkersCount();
    const maxWorkers = this.workerPoolService?.getMaxWorkers();
    PerformanceMonitor.start(operationId, activeWorkers, maxWorkers);

    try {
      const { primaryColor: finalPrimaryColor, foreignColor: finalForeignColor } =
        resolveColorScheme(this.colorSchemes, colorScheme, primaryColor, foreignColor);

      // Generate base gradient image
      const baseImageBuffers = await this.generateBaseGradients(
        finalPrimaryColor,
        finalForeignColor,
        backgroundType,
        angle,
      );

      // If emoji is provided, composite it on gradient BEFORE lowpoly processing
      let sourceImageBuffers = baseImageBuffers;
      if (emoji) {
        this.logger.log(`Compositing emoji on gradient before lowpoly: ${emoji}`);
        sourceImageBuffers = await this.compositeEmojiOnGradient(
          baseImageBuffers,
          emoji,
          emojiSize,
        );
      }

      // Apply lowpoly triangulation to gradient+emoji (or just gradient if no emoji)
      let imageBuffers: Record<AvatarSizeKey, Buffer>;

      if (this.workerPoolService?.isEnabled()) {
        try {
          const tasks = AVATAR_SIZES.map(({ key, size }) => {
            const taskId = `${id}-${size}`;
            const message: LowpolyWorkerMessage = {
              type: 'lowpoly',
              taskId,
              imageBuffer: sourceImageBuffers[key],
              size,
              pointDensity,
              colorVariation,
              edgeDetection,
            };
            return this.workerPoolService
              .executeTask(message, 'lowpoly-worker.js')
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
            sourceImageBuffers,
            pointDensity,
            colorVariation,
            edgeDetection,
          );
        }
      } else {
        imageBuffers = await this.generateSequentially(
          sourceImageBuffers,
          pointDensity,
          colorVariation,
          edgeDetection,
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
          `Lowpoly avatar generated with ID: ${id} | ${PerformanceMonitor.formatMetrics(metrics)}`,
        );
      } else {
        this.logger.log(`Lowpoly avatar generated with ID: ${id}`);
      }

      return avatarObject;
    } catch (error) {
      PerformanceMonitor.stop(operationId);
      throw error;
    }
  }

  private async generateBaseGradients(
    primaryColor?: string,
    foreignColor?: string,
    backgroundType: 'solid' | 'linear' | 'radial' = 'linear',
    angle?: number,
  ): Promise<Record<AvatarSizeKey, Buffer>> {
    const results: Record<AvatarSizeKey, Buffer> = {} as Record<AvatarSizeKey, Buffer>;
    for (const { key, size } of AVATAR_SIZES) {
      results[key] = await this.generateGradient(size, primaryColor, foreignColor, backgroundType, angle);
    }
    return results;
  }

  private async generateSequentially(
    baseImageBuffers: Record<AvatarSizeKey, Buffer>,
    pointDensity: 'low' | 'medium' | 'high',
    colorVariation: number,
    edgeDetection: boolean,
  ): Promise<Record<AvatarSizeKey, Buffer>> {
    const results: Record<AvatarSizeKey, Buffer> = {} as Record<AvatarSizeKey, Buffer>;
    for (const { key } of AVATAR_SIZES) {
      results[key] = await this.processLowpoly(
        baseImageBuffers[key],
        pointDensity,
        colorVariation,
        edgeDetection,
      );
    }
    return results;
  }

  private async generateGradient(
    size: number,
    primaryColor?: string,
    foreignColor?: string,
    backgroundType: 'solid' | 'linear' | 'radial' = 'linear',
    angle?: number,
  ): Promise<Buffer> {
    const canvas = Buffer.alloc(size * size * 4);
    const primaryRgb = this.hexToRgb(primaryColor || '#3B82F6');
    const foreignRgb = this.hexToRgb(foreignColor || '#60A5FA');

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const index = (y * size + x) * 4;
        let t = 0;

        if (backgroundType === 'solid') {
          // Solid color - no gradient, just use primary color
          t = 0;
        } else if (backgroundType === 'radial') {
          // Radial gradient - from center outward (angle is ignored for radial)
          const nx = (x / (size - 1)) * 2 - 1;
          const ny = (y / (size - 1)) * 2 - 1;
          const distance = Math.sqrt(nx * nx + ny * ny);
          t = Math.min(1, distance / Math.sqrt(2)); // Normalize to [0, 1]
        } else {
          // Linear gradient - uses angle
          const gradientAngle = angle !== undefined ? angle : 90;
          const angleRad = (gradientAngle * Math.PI) / 180;
          const nx = (x / (size - 1)) * 2 - 1;
          const ny = (y / (size - 1)) * 2 - 1;
          t = (nx * Math.cos(angleRad) + ny * Math.sin(angleRad) + 1) / 2;
        }

        const clampedT = Math.max(0, Math.min(1, t));

        canvas[index] = Math.round(primaryRgb.r + (foreignRgb.r - primaryRgb.r) * clampedT);
        canvas[index + 1] = Math.round(primaryRgb.g + (foreignRgb.g - primaryRgb.g) * clampedT);
        canvas[index + 2] = Math.round(primaryRgb.b + (foreignRgb.b - primaryRgb.b) * clampedT);
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

  private async processLowpoly(
    imageBuffer: Buffer,
    pointDensity: 'low' | 'medium' | 'high',
    colorVariation: number,
    edgeDetection: boolean,
  ): Promise<Buffer> {
    const { data, info } = await sharp(imageBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const width = info.width;
    const height = info.height;

    const points = this.generatePoints(data, width, height, pointDensity, edgeDetection);
    const triangles = this.triangulate(points);
    const lowpolyResult = await this.renderTriangles(
      triangles,
      points,
      data,
      width,
      height,
      colorVariation,
    );

    return lowpolyResult;
  }

  private generatePoints(
    data: Buffer,
    width: number,
    height: number,
    pointDensity: 'low' | 'medium' | 'high',
    edgeDetection: boolean,
  ): Point[] {
    const points: Point[] = [];

    // Determine point density multipliers
    const densityMultipliers = {
      low: { min: 0.08, max: 0.2 },
      medium: { min: 0.05, max: 0.15 },
      high: { min: 0.03, max: 0.1 },
    };

    const multiplier = densityMultipliers[pointDensity];
    const minDistance = Math.min(width, height) * multiplier.min;
    const maxDistance = Math.min(width, height) * multiplier.max;

    // Add edge contour points if enabled
    if (edgeDetection) {
      const contourPoints = this.extractContour(data, width, height, 10);
      points.push(...contourPoints);
    }

    // Generate Poisson disk sampling points
    const pds = new PoissonDiskSampling(
      {
        shape: [width, height],
        minDistance: minDistance,
        maxDistance: maxDistance,
        tries: 30,
      },
      () => Math.random(),
    );

    const poissonPoints = pds.fill();
    const poissonPointsArray: Point[] = poissonPoints.map(p => [p[0], p[1]]);
    points.push(...poissonPointsArray);

    // Add corner points to ensure full coverage
    points.push([0, 0]);
    points.push([width - 1, 0]);
    points.push([0, height - 1]);
    points.push([width - 1, height - 1]);

    return points;
  }

  private extractContour(
    data: Buffer,
    width: number,
    height: number,
    alphaThreshold: number,
  ): Point[] {
    const contourPoints: Point[] = [];
    const step = Math.max(2, Math.floor(Math.min(width, height) / 50));

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        const alpha = data[index + 3];

        if (alpha > alphaThreshold) {
          let isEdge = false;

          for (let dy = -1; dy <= 1 && !isEdge; dy++) {
            for (let dx = -1; dx <= 1 && !isEdge; dx++) {
              if (dx === 0 && dy === 0) continue;

              const nx = x + dx;
              const ny = y + dy;

              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const neighborIndex = (ny * width + nx) * 4;
                const neighborAlpha = data[neighborIndex + 3];

                if (neighborAlpha <= alphaThreshold) {
                  isEdge = true;
                }
              } else {
                isEdge = true;
              }
            }
          }

          if (isEdge) {
            contourPoints.push([x, y]);
          }
        }
      }
    }

    return contourPoints;
  }

  private triangulate(points: Point[]): number[][] {
    const flatPoints: number[] = [];
    for (const point of points) {
      flatPoints.push(point[0], point[1]);
    }

    const delaunay = new Delaunator(flatPoints);
    const triangles: number[][] = [];

    for (let i = 0; i < delaunay.triangles.length; i += 3) {
      triangles.push([delaunay.triangles[i], delaunay.triangles[i + 1], delaunay.triangles[i + 2]]);
    }

    return triangles;
  }

  private getAverageColor(
    triangle: number[],
    points: Point[],
    data: Buffer,
    width: number,
    height: number,
    colorVariation: number,
  ): { r: number; g: number; b: number; a: number } {
    const [i0, i1, i2] = triangle;
    const p0 = points[i0];
    const p1 = points[i1];
    const p2 = points[i2];

    const centerX = Math.floor((p0[0] + p1[0] + p2[0]) / 3);
    const centerY = Math.floor((p0[1] + p1[1] + p2[1]) / 3);

    const xMin = Math.max(0, Math.floor(Math.min(p0[0], p1[0], p2[0])));
    const xMax = Math.min(width - 1, Math.ceil(Math.max(p0[0], p1[0], p2[0])));
    const yMin = Math.max(0, Math.floor(Math.min(p0[1], p1[1], p2[1])));
    const yMax = Math.min(height - 1, Math.ceil(Math.max(p0[1], p1[1], p2[1])));

    let rSum = 0;
    let gSum = 0;
    let bSum = 0;
    let aSum = 0;
    let count = 0;

    for (let y = yMin; y <= yMax; y++) {
      for (let x = xMin; x <= xMax; x++) {
        if (this.pointInTriangle([x, y], p0, p1, p2)) {
          const index = (y * width + x) * 4;
          rSum += data[index];
          gSum += data[index + 1];
          bSum += data[index + 2];
          aSum += data[index + 3];
          count++;
        }
      }
    }

    if (count === 0) {
      const centerIndex = (centerY * width + centerX) * 4;
      return {
        r: data[centerIndex],
        g: data[centerIndex + 1],
        b: data[centerIndex + 2],
        a: data[centerIndex + 3],
      };
    }

    let r = Math.round(rSum / count);
    let g = Math.round(gSum / count);
    let b = Math.round(bSum / count);
    const a = Math.round(aSum / count);

    // Apply color variation if specified
    if (colorVariation > 0) {
      const variationAmount = (colorVariation / 100) * 50; // Max variation of 50
      r = Math.max(0, Math.min(255, r + (Math.random() - 0.5) * 2 * variationAmount));
      g = Math.max(0, Math.min(255, g + (Math.random() - 0.5) * 2 * variationAmount));
      b = Math.max(0, Math.min(255, b + (Math.random() - 0.5) * 2 * variationAmount));
    }

    return { r, g, b, a };
  }

  private pointInTriangle(p: Point, a: Point, b: Point, c: Point): boolean {
    const v0 = [c[0] - a[0], c[1] - a[1]];
    const v1 = [b[0] - a[0], b[1] - a[1]];
    const v2 = [p[0] - a[0], p[1] - a[1]];

    const dot00 = v0[0] * v0[0] + v0[1] * v0[1];
    const dot01 = v0[0] * v1[0] + v0[1] * v1[1];
    const dot02 = v0[0] * v2[0] + v0[1] * v2[1];
    const dot11 = v1[0] * v1[0] + v1[1] * v1[1];
    const dot12 = v1[0] * v2[0] + v1[1] * v2[1];

    const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    return u >= 0 && v >= 0 && u + v <= 1;
  }

  private async renderTriangles(
    triangles: number[][],
    points: Point[],
    data: Buffer,
    width: number,
    height: number,
    colorVariation: number,
  ): Promise<Buffer> {
    const outputBuffer = Buffer.alloc(width * height * 4);

    // Initialize with transparent background
    for (let i = 0; i < outputBuffer.length; i += 4) {
      outputBuffer[i] = 0;
      outputBuffer[i + 1] = 0;
      outputBuffer[i + 2] = 0;
      outputBuffer[i + 3] = 0;
    }

    for (const triangle of triangles) {
      const color = this.getAverageColor(triangle, points, data, width, height, colorVariation);

      if (color.a > 0) {
        const [i0, i1, i2] = triangle;
        const p0 = points[i0];
        const p1 = points[i1];
        const p2 = points[i2];

        const xMin = Math.max(0, Math.floor(Math.min(p0[0], p1[0], p2[0])));
        const xMax = Math.min(width - 1, Math.ceil(Math.max(p0[0], p1[0], p2[0])));
        const yMin = Math.max(0, Math.floor(Math.min(p0[1], p1[1], p2[1])));
        const yMax = Math.min(height - 1, Math.ceil(Math.max(p0[1], p1[1], p2[1])));

        for (let y = yMin; y <= yMax; y++) {
          for (let x = xMin; x <= xMax; x++) {
            if (this.pointInTriangle([x, y], p0, p1, p2)) {
              const index = (y * width + x) * 4;
              outputBuffer[index] = color.r;
              outputBuffer[index + 1] = color.g;
              outputBuffer[index + 2] = color.b;
              outputBuffer[index + 3] = color.a;
            }
          }
        }
      }
    }

    return await sharp(outputBuffer, {
      raw: {
        width: width,
        height: height,
        channels: 4,
      },
    })
      .png()
      .toBuffer();
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    let convertedHex = convertNamedColorToHex(hex);
    convertedHex = convertedHex.replace(/^#/, '');

    if (convertedHex.length === 3) {
      convertedHex = convertedHex
        .split('')
        .map(char => char + char)
        .join('');
    }

    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(convertedHex);

    if (!result) {
      return { r: 59, g: 130, b: 246 };
    }

    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    };
  }

  private async compositeEmojiOnGradient(
    gradientBuffers: Record<AvatarSizeKey, Buffer>,
    emoji: string,
    emojiSize: 'small' | 'medium' | 'large',
  ): Promise<Record<AvatarSizeKey, Buffer>> {
    const results: Record<AvatarSizeKey, Buffer> = {} as Record<AvatarSizeKey, Buffer>;

    // Fetch emoji SVG once
    const emojiSvg = await this.emojiService.fetchEmojiSvg(emoji);

    // Size multipliers for emoji relative to avatar size
    const sizeMultipliers = {
      small: 0.4,
      medium: 0.6,
      large: 0.8,
    };
    const multiplier = sizeMultipliers[emojiSize];

    // Composite emoji on each size
    for (const { key, size } of AVATAR_SIZES) {
      const emojiPixelSize = Math.round(size * multiplier);

      // Rasterize emoji to the appropriate size
      const emojiPng = await sharp(emojiSvg)
        .resize(emojiPixelSize, emojiPixelSize, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();

      // Composite emoji centered on gradient background
      results[key] = await sharp(gradientBuffers[key])
        .composite([
          {
            input: emojiPng,
            gravity: 'center',
          },
        ])
        .png()
        .toBuffer();
    }

    return results;
  }

  async getColorSchemes(): Promise<ColorScheme[]> {
    if (this.colorSchemes.length === 0) {
      await this.initializeColorSchemes();
    }
    return this.colorSchemes;
  }
}
