import { parentPort } from 'worker_threads';
import sharp from 'sharp';
import { WaveWorkerMessage, WorkerResponse } from '../interfaces/worker-message.interface';
import { convertNamedColorToHex } from '../../../modules/palettes/utils/color-converter.util';

function seedToNumber(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash) / 2147483647;
}

function createSeededRandom(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
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

async function generateWaveImage(
  size: number,
  primaryColor?: string,
  foreignColor?: string,
  seed?: string,
): Promise<Buffer> {
  const canvas = Buffer.alloc(size * size * 4);

  const randomSeed = seed ? seedToNumber(seed) : Math.random();
  const rng = createSeededRandom(randomSeed);

  const frequency1 = 0.1 + rng() * 0.2;
  const frequency2 = 0.15 + rng() * 0.25;
  const amplitude1 = 0.3 + rng() * 0.4;
  const amplitude2 = 0.2 + rng() * 0.3;
  const phase1 = rng() * Math.PI * 2;
  const phase2 = rng() * Math.PI * 2;

  const primaryRgb = hexToRgb(primaryColor || '#3B82F6');
  const foreignRgb = hexToRgb(foreignColor || '#60A5FA');

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4;

      const nx = x / size;
      const ny = y / size;

      const wave1 = Math.sin(nx * frequency1 * Math.PI * 2 + phase1) * amplitude1;
      const wave2 = Math.sin(ny * frequency2 * Math.PI * 2 + phase2) * amplitude2;
      const combinedWave = (wave1 + wave2) / 2;

      const centerX = 0.5;
      const centerY = 0.5;
      const distance = Math.sqrt((nx - centerX) ** 2 + (ny - centerY) ** 2);
      const radialPattern = Math.sin(distance * Math.PI * 4) * 0.3;

      const pattern = combinedWave + radialPattern;
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

if (parentPort) {
  parentPort.on('message', async (message: WaveWorkerMessage) => {
    try {
      const buffer = await generateWaveImage(
        message.size,
        message.primaryColor,
        message.foreignColor,
        message.seed,
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
