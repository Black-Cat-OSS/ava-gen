import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { AvatarObject, ColorScheme } from '../../../../common/interfaces/avatar-object.interface';
import { IGeneratorStrategy } from '../../../../common/interfaces/generator-strategy.interface';
import { PalettesService } from '../../../../modules/palettes';
import { convertNamedColorToHex } from '../../../../modules/palettes/utils/color-converter.util';

@Injectable()
export class PixelizeGeneratorModule implements IGeneratorStrategy {
  private readonly logger = new Logger(PixelizeGeneratorModule.name);

  private colorSchemes: ColorScheme[] = [];

  constructor(private readonly palettesService: PalettesService) {
    this.initializeColorSchemes();
  }

  private async initializeColorSchemes(): Promise<void> {
    try {
      this.colorSchemes = await this.palettesService.getColorSchemes();
      this.logger.log(`Loaded ${this.colorSchemes.length} color schemes from palettes service`);
    } catch (error) {
      this.logger.error(`Failed to load color schemes: ${error.message}`, error);
      this.colorSchemes = [];
    }
  }

  async generateAvatar(
    primaryColor?: string,
    foreignColor?: string,
    colorScheme?: string,
    seed?: string,
    _angle?: number,
  ): Promise<AvatarObject> {
    this.logger.log('Generating new pixelize avatar');

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

    const uniqueSeed = seed ? seed + '-' + Date.now() + '-' + Math.random() : uuidv4();

    // Generate images for all required sizes (4n to 9n)
    const avatarObject: AvatarObject = {
      meta_data_name: id,
      meta_data_created_at: now,
      image_4n: await this.generateImageForSize(
        16,
        finalPrimaryColor,
        finalForeignColor,
        uniqueSeed,
      ), // 2^4 = 16
      image_5n: await this.generateImageForSize(
        32,
        finalPrimaryColor,
        finalForeignColor,
        uniqueSeed,
      ), // 2^5 = 32
      image_6n: await this.generateImageForSize(
        64,
        finalPrimaryColor,
        finalForeignColor,
        uniqueSeed,
      ), // 2^6 = 64
      image_7n: await this.generateImageForSize(
        128,
        finalPrimaryColor,
        finalForeignColor,
        uniqueSeed,
      ), // 2^7 = 128
      image_8n: await this.generateImageForSize(
        256,
        finalPrimaryColor,
        finalForeignColor,
        uniqueSeed,
      ), // 2^8 = 256
      image_9n: await this.generateImageForSize(
        512,
        finalPrimaryColor,
        finalForeignColor,
        uniqueSeed,
      ), // 2^9 = 512
    };

    this.logger.log(`Pixelize avatar generated with ID: ${id}`);
    return avatarObject;
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

    const gridSize = 7;
    const cellSize = size / gridSize;

    const pattern: boolean[][] = [];
    for (let i = 0; i < gridSize; i++) {
      pattern[i] = [];
      for (let j = 0; j < Math.ceil(gridSize / 2); j++) {
        pattern[i][j] = rng() > 0.5;
      }
    }

    const primaryRgb = this.hexToRgb(primaryColor || '#3B82F6');
    const foreignRgb = this.hexToRgb(foreignColor || '#60A5FA');

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
    const convertedHex = convertNamedColorToHex(hex);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(convertedHex);

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
