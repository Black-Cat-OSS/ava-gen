import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { AvatarObject } from '../../../../common/interfaces/avatar-object.interface';
import { IGeneratorStrategy } from '../../../../common/interfaces/generator-strategy.interface';
import { PixelizeGeneratorModule } from '../pixelize-driver';
import { WaveGeneratorModule } from '../wave-driver';
import { GradientGeneratorModule } from '../gradient-driver/gradient-generator.module';
import { EmojiGeneratorModule } from '../emoji-driver';

/**
 * Главный сервис генерации аватаров
 *
 * Использует паттерн Strategy для поддержки различных типов генерации.
 * Выбор стратегии происходит на основе параметра type.
 *
 * @class GeneratorService
 */
@Injectable()
export class GeneratorService {
  private readonly logger = new Logger(GeneratorService.name);

  constructor(
    private readonly pixelizeGenerator: PixelizeGeneratorModule,
    private readonly waveGenerator: WaveGeneratorModule,
    private readonly gradientGenerator: GradientGeneratorModule,
    private readonly emojiGenerator: EmojiGeneratorModule,
  ) {}

  async generateAvatar(
    primaryColor?: string,
    foreignColor?: string,
    colorScheme?: string,
    seed?: string,
    type: string = 'pixelize',
    angle?: number,
  ): Promise<AvatarObject> {
    this.logger.log(`Generating avatar with type: ${type}`);

    const generator = this.getGenerator(type);
    return await generator.generateAvatar(primaryColor, foreignColor, colorScheme, seed, angle);
  }

  async generateEmojiAvatar(
    emoji: string,
    backgroundType: 'solid' | 'linear' | 'radial',
    primaryColor?: string,
    foreignColor?: string,
    colorScheme?: string,
    angle?: number,
    emojiSize?: 'small' | 'medium' | 'large',
  ): Promise<AvatarObject> {
    this.logger.log('Generating emoji avatar');
    return await this.emojiGenerator.generateAvatar(
      primaryColor,
      foreignColor,
      colorScheme,
      undefined, // Emoji generator doesn't use seed
      angle,
      emoji,
      backgroundType,
      emojiSize,
    );
  }

  async checkTwemojiAvailability(): Promise<boolean> {
    return await this.emojiGenerator.checkTwemojiAvailability();
  }

  getColorSchemes(
    type: string = 'pixelize',
  ): Promise<Array<{ name: string; primaryColor: string; foreignColor: string }>> {
    const generator = this.getGenerator(type);
    return await generator.getColorSchemes();
  }

  private getGenerator(type: string): IGeneratorStrategy {
    switch (type.toLowerCase()) {
      case 'pixelize':
        return this.pixelizeGenerator;
      case 'wave':
        return this.waveGenerator;
      case 'gradient':
        return this.gradientGenerator;
      case 'emoji':
        return this.emojiGenerator;
      default:
        throw new BadRequestException(`Unsupported generator type: ${type}`);
    }
  }
}
