import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { AvatarObject, ColorScheme } from '../../../../common/interfaces/avatar-object.interface';
import { IGeneratorStrategy } from '../../../../common/interfaces/generator-strategy.interface';
import { EmojiService } from '../../../../modules/emoji';
import { WorkerPoolService } from '../../utils/worker-pool.service';
import { EmojiWorkerMessage } from '../../interfaces/worker-message.interface';

/**
 * Генератор эмодзи-аватаров
 *
 * Создает аватары с эмодзи на различных типах фона (сплошной, линейный градиент, радиальный градиент).
 * Использует Twemoji CDN для получения SVG эмодзи и растеризации их в PNG.
 *
 * @class EmojiGeneratorModule
 */
@Injectable()
export class EmojiGeneratorModule implements IGeneratorStrategy {
  private readonly logger = new Logger(EmojiGeneratorModule.name);
  private readonly emojiCache = new Map<string, Buffer>();

  constructor(
    private readonly emojiService: EmojiService,
    private readonly workerPoolService?: WorkerPoolService,
  ) {}

  private readonly colorSchemes: ColorScheme[] = [
    // Basic color schemes
    { name: 'green', primaryColor: 'green', foreignColor: 'lightgreen' },
    { name: 'blue', primaryColor: 'blue', foreignColor: 'lightblue' },
    { name: 'red', primaryColor: 'red', foreignColor: 'pink' },
    { name: 'orange', primaryColor: 'orange', foreignColor: 'yellow' },
    { name: 'purple', primaryColor: 'purple', foreignColor: 'violet' },
    { name: 'teal', primaryColor: 'teal', foreignColor: 'cyan' },
    { name: 'indigo', primaryColor: 'indigo', foreignColor: 'blue' },
    { name: 'pink', primaryColor: 'pink', foreignColor: 'rose' },
    { name: 'emerald', primaryColor: 'emerald', foreignColor: 'green' },
    // Frontend color palettes
    { name: 'default', primaryColor: '#3b82f6', foreignColor: '#ef4444' },
    { name: 'monochrome', primaryColor: '#333333', foreignColor: '#666666' },
    { name: 'vibrant', primaryColor: '#FF6B35', foreignColor: '#F7931E' },
    { name: 'pastel', primaryColor: '#FFB3BA', foreignColor: '#FFDFBA' },
    { name: 'ocean', primaryColor: '#0077BE', foreignColor: '#00A8CC' },
    { name: 'sunset', primaryColor: '#FF8C42', foreignColor: '#FF6B35' },
    { name: 'forest', primaryColor: '#2E8B57', foreignColor: '#32CD32' },
    { name: 'royal', primaryColor: '#6A0DAD', foreignColor: '#8A2BE2' },
  ];

  async generateAvatar(
    primaryColor?: string,
    foreignColor?: string,
    colorScheme?: string,
    seed?: string,
    angle?: number,
    emoji?: string,
    backgroundType?: 'solid' | 'linear' | 'radial',
    emojiSize?: 'small' | 'medium' | 'large',
  ): Promise<AvatarObject> {
    this.logger.log('Generating new emoji avatar');

    const id = uuidv4();
    const now = new Date();

    // Determine colors
    let finalPrimaryColor = primaryColor;
    let finalForeignColor = foreignColor;

    if (colorScheme) {
      const scheme = this.colorSchemes.find(s => s.name === colorScheme);
      if (scheme) {
        finalPrimaryColor = scheme.primaryColor;
        finalForeignColor = scheme.foreignColor;
      }
    }

    const finalEmoji = emoji || '😀';
    const finalBackgroundType = backgroundType || 'solid';
    const finalEmojiSize = emojiSize || 'large';

    const sizes = [
      { key: 'image_4n' as const, size: 16 },
      { key: 'image_5n' as const, size: 32 },
      { key: 'image_6n' as const, size: 64 },
      { key: 'image_7n' as const, size: 128 },
      { key: 'image_8n' as const, size: 256 },
      { key: 'image_9n' as const, size: 512 },
    ];

    let imageBuffers: Record<string, Buffer>;

    if (this.workerPoolService?.isEnabled()) {
      try {
        const tasks = sizes.map(({ key, size }) => {
          const taskId = `${id}-${size}`;
          const message: EmojiWorkerMessage = {
            type: 'emoji',
            taskId,
            size,
            primaryColor: finalPrimaryColor,
            foreignColor: finalForeignColor,
            emoji: finalEmoji,
            backgroundType: finalBackgroundType,
            emojiSize: finalEmojiSize,
            angle,
          };
          return this.workerPoolService
            .executeTask(message, 'emoji-worker.js')
            .then(buffer => ({ key, buffer }));
        });

        const results = await Promise.all(tasks);
        imageBuffers = Object.fromEntries(results.map(r => [r.key, r.buffer]));
      } catch (error) {
        this.logger.warn(
          `Parallel generation failed, falling back to sequential: ${error.message}`,
        );
        imageBuffers = await this.generateSequentially(
          sizes,
          finalPrimaryColor,
          finalForeignColor,
          finalEmoji,
          finalBackgroundType,
          finalEmojiSize,
          angle,
        );
      }
    } else {
      imageBuffers = await this.generateSequentially(
        sizes,
        finalPrimaryColor,
        finalForeignColor,
        finalEmoji,
        finalBackgroundType,
        finalEmojiSize,
        angle,
      );
    }

    const avatarObject: AvatarObject = {
      meta_data_name: id,
      meta_data_created_at: now,
      meta_data_payload: {
        emoji: finalEmoji,
        backgroundType: finalBackgroundType,
        emojiSize: finalEmojiSize,
        angle: angle,
      },
      image_4n: imageBuffers.image_4n,
      image_5n: imageBuffers.image_5n,
      image_6n: imageBuffers.image_6n,
      image_7n: imageBuffers.image_7n,
      image_8n: imageBuffers.image_8n,
      image_9n: imageBuffers.image_9n,
    };

    this.logger.log(`Emoji avatar generated with ID: ${id}`);
    return avatarObject;
  }

  /**
   * Проверка доступности Twemoji CDN
   *
   * @returns {Promise<boolean>} true если CDN доступен
   */
  async checkTwemojiAvailability(): Promise<boolean> {
    return await this.emojiService.checkTwemojiAvailability();
  }

  private async generateSequentially(
    sizes: Array<{ key: string; size: number }>,
    primaryColor?: string,
    foreignColor?: string,
    emoji?: string,
    backgroundType?: 'solid' | 'linear' | 'radial',
    emojiSize?: 'small' | 'medium' | 'large',
    angle?: number,
  ): Promise<Record<string, Buffer>> {
    const results: Record<string, Buffer> = {};
    for (const { key, size } of sizes) {
      results[key] = await this.generateImageForSize(
        size,
        primaryColor,
        foreignColor,
        emoji,
        backgroundType,
        emojiSize,
        angle,
      );
    }
    return results;
  }

  private async generateImageForSize(
    size: number,
    primaryColor?: string,
    foreignColor?: string,
    emoji?: string,
    backgroundType?: 'solid' | 'linear' | 'radial',
    emojiSize?: 'small' | 'medium' | 'large',
    angle?: number,
  ): Promise<Buffer> {
    // Generate background
    const backgroundBuffer = await this.generateBackground(
      size,
      primaryColor,
      foreignColor,
      backgroundType || 'solid',
      angle,
    );

    // Fetch and rasterize emoji
    const emojiBuffer = await this.fetchAndRasterizeEmoji(
      emoji || '😀',
      size,
      emojiSize || 'large',
    );

    // Composite emoji on background
    return await this.compositeEmojiOnBackground(backgroundBuffer, emojiBuffer, size);
  }

  private async generateBackground(
    size: number,
    primaryColor?: string,
    foreignColor?: string,
    backgroundType: 'solid' | 'linear' | 'radial' = 'solid',
    angle?: number,
  ): Promise<Buffer> {
    const primaryRgb = this.hexToRgb(primaryColor || '#3B82F6');
    const foreignRgb = this.hexToRgb(foreignColor || '#60A5FA');

    if (backgroundType === 'solid') {
      return await this.generateSolidBackground(size, primaryRgb);
    } else if (backgroundType === 'linear') {
      return await this.generateLinearGradientBackground(size, primaryRgb, foreignRgb, angle || 90);
    } else if (backgroundType === 'radial') {
      return await this.generateRadialGradientBackground(size, primaryRgb, foreignRgb);
    }

    throw new Error(`Unsupported background type: ${backgroundType}`);
  }

  private async generateSolidBackground(
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

  private async generateLinearGradientBackground(
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

        // Normalize coordinates to [-1, 1]
        const nx = (x / (size - 1)) * 2 - 1;
        const ny = (y / (size - 1)) * 2 - 1;

        // Calculate position along gradient direction
        const t = (nx * Math.cos(angleRad) + ny * Math.sin(angleRad) + 1) / 2;
        const clampedT = Math.max(0, Math.min(1, t));

        // Interpolate between colors
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

  private async generateRadialGradientBackground(
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

        // Calculate distance from center
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const t = Math.min(distance / maxDistance, 1);

        // Interpolate between colors
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

  private async fetchAndRasterizeEmoji(
    emoji: string,
    avatarSize: number,
    emojiSize: 'small' | 'medium' | 'large',
  ): Promise<Buffer> {
    const cacheKey = `${emoji}-${avatarSize}-${emojiSize}`;

    if (this.emojiCache.has(cacheKey)) {
      return this.emojiCache.get(cacheKey)!;
    }

    try {
      // Fetch SVG from EmojiService
      const svgBuffer = await this.emojiService.fetchEmojiSvg(emoji);

      // Calculate emoji size based on avatar size
      const sizeMultiplier = emojiSize === 'small' ? 0.4 : emojiSize === 'medium' ? 0.6 : 0.8;
      const emojiPixelSize = Math.round(avatarSize * sizeMultiplier);

      // Rasterize using EmojiService
      const rasterizedEmoji = await this.emojiService.rasterizeEmoji(svgBuffer, {
        width: emojiPixelSize,
        height: emojiPixelSize,
        format: 'png',
      });

      this.emojiCache.set(cacheKey, rasterizedEmoji);
      return rasterizedEmoji;
    } catch (error) {
      this.logger.error(`Failed to fetch and rasterize emoji ${emoji}: ${error.message}`);
      throw error;
    }
  }

  private async compositeEmojiOnBackground(
    backgroundBuffer: Buffer,
    emojiBuffer: Buffer,
    _size: number,
  ): Promise<Buffer> {
    return await sharp(backgroundBuffer)
      .composite([
        {
          input: emojiBuffer,
          gravity: 'center',
        },
      ])
      .png()
      .toBuffer();
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    // Handle named colors
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
    return this.colorSchemes;
  }
}
