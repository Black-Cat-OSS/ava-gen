import { parentPort } from 'worker_threads';
import sharp from 'sharp';
import { PixelizeWorkerMessage, WorkerResponse } from '../interfaces/worker-message.interface';
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

async function generatePixelizeImage(
  size: number,
  primaryColor?: string,
  foreignColor?: string,
  seed?: string,
): Promise<Buffer> {
  const canvas = Buffer.alloc(size * size * 4);

  const randomSeed = seed ? seedToNumber(seed) : Math.random();
  const rng = createSeededRandom(randomSeed);

  const gridSize = 7;
  const cellSize = size / gridSize;

  const pattern: boolean[][] = [];
  for (let i = 0; i < gridSize; i++) {
    pattern[i] = [];
    for (let j = 0; j < Math.ceil(gridSize / 2); j++) {
      pattern[i][j] = rng() > 0.5;
    }
  }

  const primaryRgb = hexToRgb(primaryColor || '#3B82F6');
  const foreignRgb = hexToRgb(foreignColor || '#60A5FA');

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4;

      const gridX = Math.floor(x / cellSize);
      const gridY = Math.floor(y / cellSize);

      let patternX = gridX;
      if (gridX >= Math.ceil(gridSize / 2)) {
        patternX = gridSize - 1 - gridX;
      }

      const isFilled = pattern[gridY] && pattern[gridY][patternX];

      const color = isFilled ? primaryRgb : foreignRgb;

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
  parentPort.on('message', async (message: PixelizeWorkerMessage) => {
    try {
      const buffer = await generatePixelizeImage(
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
