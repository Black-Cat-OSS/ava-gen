import { Injectable, Logger } from '@nestjs/common';
import { PalettesService } from '../../palettes.service';
import { IInitializer } from '../../../initialization/interfaces/initializer.interface';

/**
 * Initializer service for color palettes
 * Seeds palettes on application startup
 */
@Injectable()
export class PalettesInitializerService implements IInitializer {
  private readonly logger = new Logger(PalettesInitializerService.name);

  constructor(private readonly palettesService: PalettesService) {}

  getInitializerId(): string {
    return 'PalettesInitializer';
  }

  getPriority(): number {
    return 100;
  }

  async isReady(): Promise<boolean> {
    return true;
  }

  async initialize(): Promise<void> {
    this.logger.log('Initializing color palettes...');
    try {
      await this.palettesService.seedPalettes();
      this.logger.log('Color palettes initialized successfully');
    } catch (error) {
      this.logger.warn(
        `Failed to initialize color palettes: ${error.message}. This may be normal if tables don't exist yet.`,
      );
    }
  }

  async onModuleInit(): Promise<void> {
    await this.initialize();
  }
}
