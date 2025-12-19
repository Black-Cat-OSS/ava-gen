import { parentPort } from 'worker_threads';
import sharp from 'sharp';
import { EmojiWorkerMessage, WorkerResponse } from '../interfaces/worker-message.interface';

const twemojiBaseUrl = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/';

function getEmojiCodepoints(emoji: string): string[] {
  const codePoints: string[] = [];
  for (let i = 0; i < emoji.length; i++) {
    const codePoint = emoji.codePointAt(i);
    if (codePoint !== undefined) {
      codePoints.push(codePoint.toString(16));
      if (codePoint > 0xffff) {
        i++;
      }
    }
  }
  return codePoints;
}

function getEmojiFilename(emoji: string): string {
  return getEmojiCodepoints(emoji).join('-');
}

async function fetchEmojiSvg(emoji: string): Promise<Buffer> {
  const filename = getEmojiFilename(emoji);
  const svgUrl = `${twemojiBaseUrl}${filename}.svg`;

  let response = await fetch(svgUrl);

  if (!response.ok && emoji.includes('\uFE0F')) {
    const emojiWithoutVS = emoji.replace(/\uFE0F/g, '');
    const fallbackFilename = getEmojiFilename(emojiWithoutVS);
    const fallbackUrl = `${twemojiBaseUrl}${fallbackFilename}.svg`;
    response = await fetch(fallbackUrl);
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch emoji SVG: ${response.status} ${response.statusText}`);
  }

  const svgText = await response.text();
  return Buffer.from(svgText, 'utf-8');
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const namedColors: { [key: string]: string } = {
    green: '#22C55E',
    lightgreen: '#86EFAC',
    blue: '#3B82F6',
    lightblue: '#60A5FA',
    red: '#EF4444',
    pink: '#F472B6',
    purple: '#A855F7',
    violet: '#C084FC',
    orange: '#F97316',
    yellow: '#FDE047',
    teal: '#14B8A6',
    cyan: '#06B6D4',
    indigo: '#6366F1',
    rose: '#F43F5E',
    emerald: '#10B981',
  };

  const color = namedColors[hex.toLowerCase()] || hex;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);

  if (!result) {
    return { r: 59, g: 130, b: 246 };
  }

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

async function generateSolidBackground(
  size: number,
  color: { r: number; g: number; b: number },
): Promise<Buffer> {
  const canvas = Buffer.alloc(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4;
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

async function generateLinearGradientBackground(
  size: number,
  primaryColor: { r: number; g: number; b: number },
  foreignColor: { r: number; g: number; b: number },
  angle: number,
): Promise<Buffer> {
  const canvas = Buffer.alloc(size * size * 4);
  const angleRad = (angle * Math.PI) / 180;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4;

      const nx = (x / (size - 1)) * 2 - 1;
      const ny = (y / (size - 1)) * 2 - 1;

      const t = (nx * Math.cos(angleRad) + ny * Math.sin(angleRad) + 1) / 2;
      const clampedT = Math.max(0, Math.min(1, t));

      const r = Math.round(primaryColor.r + (foreignColor.r - primaryColor.r) * clampedT);
      const g = Math.round(primaryColor.g + (foreignColor.g - primaryColor.g) * clampedT);
      const b = Math.round(primaryColor.b + (foreignColor.b - primaryColor.b) * clampedT);

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

async function generateRadialGradientBackground(
  size: number,
  primaryColor: { r: number; g: number; b: number },
  foreignColor: { r: number; g: number; b: number },
): Promise<Buffer> {
  const canvas = Buffer.alloc(size * size * 4);
  const centerX = size / 2;
  const centerY = size / 2;
  const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4;

      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      const t = Math.min(distance / maxDistance, 1);

      const r = Math.round(primaryColor.r + (foreignColor.r - primaryColor.r) * t);
      const g = Math.round(primaryColor.g + (foreignColor.g - primaryColor.g) * t);
      const b = Math.round(primaryColor.b + (foreignColor.b - primaryColor.b) * t);

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

async function generateEmojiImage(
  size: number,
  primaryColor?: string,
  foreignColor?: string,
  emoji?: string,
  backgroundType?: 'solid' | 'linear' | 'radial',
  emojiSize?: 'small' | 'medium' | 'large',
  angle?: number,
): Promise<Buffer> {
  const primaryRgb = hexToRgb(primaryColor || '#3B82F6');
  const foreignRgb = hexToRgb(foreignColor || '#60A5FA');

  let backgroundBuffer: Buffer;
  if (backgroundType === 'solid') {
    backgroundBuffer = await generateSolidBackground(size, primaryRgb);
  } else if (backgroundType === 'linear') {
    backgroundBuffer = await generateLinearGradientBackground(
      size,
      primaryRgb,
      foreignRgb,
      angle || 90,
    );
  } else if (backgroundType === 'radial') {
    backgroundBuffer = await generateRadialGradientBackground(size, primaryRgb, foreignRgb);
  } else {
    backgroundBuffer = await generateSolidBackground(size, primaryRgb);
  }

  const svgBuffer = await fetchEmojiSvg(emoji || '😀');
  const sizeMultiplier = emojiSize === 'small' ? 0.4 : emojiSize === 'medium' ? 0.6 : 0.8;
  const emojiPixelSize = Math.round(size * sizeMultiplier);

  const rasterizedEmoji = await sharp(svgBuffer)
    .resize(emojiPixelSize, emojiPixelSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  return await sharp(backgroundBuffer)
    .composite([
      {
        input: rasterizedEmoji,
        gravity: 'center',
      },
    ])
    .png()
    .toBuffer();
}

if (parentPort) {
  parentPort.on('message', async (message: EmojiWorkerMessage) => {
    try {
      const buffer = await generateEmojiImage(
        message.size,
        message.primaryColor,
        message.foreignColor,
        message.emoji,
        message.backgroundType,
        message.emojiSize,
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
