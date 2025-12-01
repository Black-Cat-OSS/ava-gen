import { parentPort } from 'worker_threads';
import sharp from 'sharp';
import Delaunator from 'delaunator';
import PoissonDiskSampling from 'poisson-disk-sampling';
import { LowpolyWorkerMessage, WorkerResponse } from '../interfaces/worker-message.interface';

type Point = [number, number];

async function generateLowpolyImage(
  imageBuffer: Buffer,
  size: number,
  pointDensity?: 'low' | 'medium' | 'high',
  colorVariation?: number,
  edgeDetection?: boolean,
): Promise<Buffer> {
  // The imageBuffer already contains the base gradient/background image
  // We just need to apply the lowpoly triangulation effect
  const sourceData = await sharp(imageBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = sourceData.info.width;
  const height = sourceData.info.height;

  const points = generatePoints(
    sourceData.data,
    width,
    height,
    pointDensity || 'medium',
    edgeDetection !== false, // Default to true
  );
  const triangles = triangulate(points);
  const lowpolyResult = await renderTriangles(
    triangles,
    points,
    sourceData.data,
    width,
    height,
    colorVariation || 0,
  );

  return lowpolyResult;
}

function generatePoints(
  data: Buffer,
  width: number,
  height: number,
  pointDensity: 'low' | 'medium' | 'high',
  edgeDetection: boolean,
): Point[] {
  const points: Point[] = [];
  const alphaThreshold = 10;

  // Apply edge detection if enabled
  if (edgeDetection) {
    const contourPoints = extractContour(data, width, height, alphaThreshold);
    points.push(...contourPoints);
  }

  // Adjust point density based on setting
  const densityMultiplier = pointDensity === 'low' ? 0.7 : pointDensity === 'high' ? 1.5 : 1.0;
  const minDistance = Math.min(width, height) * 0.05 * (1 / densityMultiplier);
  const maxDistance = Math.min(width, height) * 0.15 * (1 / densityMultiplier);

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

  points.push([0, 0]);
  points.push([width - 1, 0]);
  points.push([0, height - 1]);
  points.push([width - 1, height - 1]);

  return points;
}

function extractContour(
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

function triangulate(points: Point[]): number[][] {
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

function getAverageColor(
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
      if (pointInTriangle([x, y], p0, p1, p2)) {
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

function pointInTriangle(p: Point, a: Point, b: Point, c: Point): boolean {
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

async function renderTriangles(
  triangles: number[][],
  points: Point[],
  data: Buffer,
  width: number,
  height: number,
  colorVariation: number,
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
    let color = getAverageColor(triangle, points, data, width, height);

    // Apply color variation if specified
    if (colorVariation > 0) {
      const variation = colorVariation / 100; // Convert percentage to 0-1 range
      const randomFactor = () => 1 + (Math.random() - 0.5) * 2 * variation;
      color = {
        r: Math.max(0, Math.min(255, Math.round(color.r * randomFactor()))),
        g: Math.max(0, Math.min(255, Math.round(color.g * randomFactor()))),
        b: Math.max(0, Math.min(255, Math.round(color.b * randomFactor()))),
        a: color.a,
      };
    }

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
          if (pointInTriangle([x, y], p0, p1, p2)) {
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

if (parentPort) {
  parentPort.on('message', async (message: LowpolyWorkerMessage) => {
    try {
      const buffer = await generateLowpolyImage(
        message.imageBuffer,
        message.size,
        message.pointDensity,
        message.colorVariation,
        message.edgeDetection,
      );

      const arrayBuffer =
        buffer.buffer instanceof ArrayBuffer
          ? buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
          : new Uint8Array(buffer).buffer;

      const response: WorkerResponse = {
        taskId: message.taskId,
        success: true,
        buffer: buffer,
      };

      parentPort!.postMessage(response, [arrayBuffer]);
    } catch (error) {
      const response: WorkerResponse = {
        taskId: message.taskId,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      parentPort!.postMessage(response);
    }
  });
}
