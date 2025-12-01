import { Module, DynamicModule } from '@nestjs/common';
import { PixelizeGeneratorModule } from '../pixelize-driver';
import { WaveGeneratorModule } from '../wave-driver';
import { GradientGeneratorModule } from '../gradient-driver/gradient-generator.module';
import { EmojiGeneratorModule } from '../emoji-driver';
import { LowpolyGeneratorModule } from '../lowpoly-driver';
import { GeneratorService } from './generator.service';
import { EmojiModule } from '../../../emoji';

/**
 * Главный модуль генераторов аватаров
 *
 * Динамически подключает все доступные драйверы генераторов.
 * Использует паттерн Strategy для поддержки различных типов генерации.
 *
 * @module GeneratorModule
 */
@Module({})
export class GeneratorModule {
  /**
   * Регистрация модуля с подключением всех драйверов генераторов
   *
   * @static
   * @returns {DynamicModule} Динамический модуль
   */
  static register(): DynamicModule {
    return {
      module: GeneratorModule,
      imports: [EmojiModule], // Import EmojiModule to make EmojiService available
      providers: [
        GeneratorService,
        PixelizeGeneratorModule,
        WaveGeneratorModule,
        GradientGeneratorModule,
        EmojiGeneratorModule,
        LowpolyGeneratorModule,
      ],
      exports: [GeneratorService],
    };
  }
}
