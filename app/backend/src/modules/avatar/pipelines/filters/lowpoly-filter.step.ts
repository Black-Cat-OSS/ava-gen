import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import Delaunator from 'delaunator';
import PoissonDiskSampling from 'poisson-disk-sampling';
import { IPipelineStep } from '../../../../common/interfaces/pipeline-step.interface';

type Point = [number, number];

/**
 * Шаг pipeline для применения lowpoly фильтра
 *
 * Преобразует изображение в low-poly стиль используя триангуляцию Делаунея.
 * Используется как fallback режим, когда workers недоступны.
 *
 * @class LowpolyFilterStep
 */
@Injectable()
export class LowpolyFilterStep implements IPipelineStep<Buffer> {
  /**
   * Применить lowpoly фильтр к изображению
   *
   * @param {Buffer} imageBuffer - Буфер изображения
   * @param {string} generatorType - Тип генератора (опционально)
   * @param {string} primaryColor - Основной цвет для градиента (опционально)
   * @param {string} foreignColor - Дополнительный цвет для градиента (опционально)
   * @param {number} angle - Угол для градиента (опционально)
   * @returns {Promise<Buffer>} Обработанный буфер изображения
   */
  async process(
    imageBuffer: Buffer,
    generatorType?: string,
    primaryColor?: string,
    foreignColor?: string,
    angle?: number,
  ): Promise<Buffer> {
    const { info } = await sharp(imageBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const width = info.width;
    const height = info.height;

    let backgroundBuffer: Buffer | null = null;
    let emojiBuffer: Buffer | null = null;
    let sourceImageBuffer = imageBuffer;

    if (generatorType === 'gradient') {
      backgroundBuffer = await this.generateLinearGradientBackground(
        width,
        primaryColor,
        foreignColor,
        angle,
      );
      sourceImageBuffer = backgroundBuffer;
    } else if (generatorType === 'emoji') {
      backgroundBuffer = await this.generateLinearGradientBackground(
        width,
        primaryColor,
        foreignColor,
        angle,
      );
      emojiBuffer = await this.extractEmojiFromImage(imageBuffer);

      if (emojiBuffer) {
        const compositeBuffer = await sharp(backgroundBuffer)
          .composite([
            {
              input: emojiBuffer,
              gravity: 'center',
            },
          ])
          .png()
          .toBuffer();

        sourceImageBuffer = compositeBuffer;
      } else {
        sourceImageBuffer = backgroundBuffer;
      }
    }

    const sourceData = await sharp(sourceImageBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const points = this.generatePoints(sourceData.data, width, height);
    const triangles = this.triangulate(points);
    const lowpolyResult = await this.renderTriangles(
      triangles,
      points,
      sourceData.data,
      width,
      height,
    );

    if (backgroundBuffer && generatorType === 'gradient') {
      return await sharp(backgroundBuffer)
        .composite([
          {
            input: lowpolyResult,
            blend: 'over',
          },
        ])
        .png()
        .toBuffer();
    }

    return lowpolyResult;
  }

  private generatePoints(data: Buffer, width: number, height: number): Point[] {
    const points: Point[] = [];
    const alphaThreshold = 10;

    const contourPoints = this.extractContour(data, width, height, alphaThreshold);

    const minDistance = Math.min(width, height) * 0.05;
    const maxDistance = Math.min(width, height) * 0.15;

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

    points.push(...contourPoints);
    points.push(...poissonPointsArray);

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

    return {
      r: Math.round(rSum / count),
      g: Math.round(gSum / count),
      b: Math.round(bSum / count),
      a: Math.round(aSum / count),
    };
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

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 59, g: 130, b: 246 };
  }

  private async generateLinearGradientBackground(
    size: number,
    primaryColor?: string,
    foreignColor?: string,
    angle?: number,
  ): Promise<Buffer> {
    const canvas = Buffer.alloc(size * size * 4);
    const gradientAngle = angle !== undefined ? angle : 90;
    const primaryRgb = this.hexToRgb(primaryColor || '#3B82F6');
    const foreignRgb = this.hexToRgb(foreignColor || '#60A5FA');
    const angleRad = (gradientAngle * Math.PI) / 180;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const index = (y * size + x) * 4;
        const nx = (x / (size - 1)) * 2 - 1;
        const ny = (y / (size - 1)) * 2 - 1;
        const t = (nx * Math.cos(angleRad) + ny * Math.sin(angleRad) + 1) / 2;
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

  private async extractEmojiFromImage(imageBuffer: Buffer): Promise<Buffer> {
    const { data: imageData, info } = await sharp(imageBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const width = info.width;
    const height = info.height;
    const emojiBuffer = Buffer.alloc(width * height * 4);
    const alphaThreshold = 10;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const alpha = imageData[index + 3];

        if (alpha > alphaThreshold) {
          emojiBuffer[index] = imageData[index];
          emojiBuffer[index + 1] = imageData[index + 1];
          emojiBuffer[index + 2] = imageData[index + 2];
          emojiBuffer[index + 3] = imageData[index + 3];
        } else {
          emojiBuffer[index] = 0;
          emojiBuffer[index + 1] = 0;
          emojiBuffer[index + 2] = 0;
          emojiBuffer[index + 3] = 0;
        }
      }
    }

    return await sharp(emojiBuffer, {
      raw: {
        width: width,
        height: height,
        channels: 4,
      },
    })
      .png()
      .toBuffer();
  }

  private async renderTriangles(
    triangles: number[][],
    points: Point[],
    data: Buffer,
    width: number,
    height: number,
  ): Promise<Buffer> {
    const outputBuffer = Buffer.alloc(width * height * 4);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        outputBuffer[index] = 0;
        outputBuffer[index + 1] = 0;
        outputBuffer[index + 2] = 0;
        outputBuffer[index + 3] = 0;
      }
    }

    for (const triangle of triangles) {
      const color = this.getAverageColor(triangle, points, data, width, height);

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
}
