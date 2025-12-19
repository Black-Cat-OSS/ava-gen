import { parentPort } from 'worker_threads';
import sharp from 'sharp';
import { GradientWorkerMessage, WorkerResponse } from '../interfaces/worker-message.interface';
import { convertNamedColorToHex } from '../../../modules/palettes/utils/color-converter.util';

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

async function generateGradientImage(
  size: number,
  primaryColor?: string,
  foreignColor?: string,
  angle?: number,
): Promise<Buffer> {
  const canvas = Buffer.alloc(size * size * 4);

  const gradientAngle = angle !== undefined ? angle : 90;
  const primaryRgb = hexToRgb(primaryColor || '#3B82F6');
  const foreignRgb = hexToRgb(foreignColor || '#60A5FA');

  const angleRad = (gradientAngle * Math.PI) / 180;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4;

      const nx = (x / (size - 1)) * 2 - 1;
      const ny = (y / (size - 1)) * 2 - 1;

      const t = (nx * Math.cos(angleRad) + ny * Math.sin(angleRad) + 1) / 2;
      const clampedT = Math.max(0, Math.min(1, t));

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

if (parentPort) {
  parentPort.on('message', async (message: GradientWorkerMessage) => {
    try {
      const buffer = await generateGradientImage(
        message.size,
        message.primaryColor,
        message.foreignColor,
        message.angle,
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
