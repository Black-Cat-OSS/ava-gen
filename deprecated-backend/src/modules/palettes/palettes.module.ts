import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Palette } from './palette.entity';
import { PalettesService } from './palettes.service';
import { PalettesController } from './palettes.controller';
import { PalettesInitializationModule } from './modules/initialization';

/**
 * Global module for managing color palettes
 * Provides centralized palette storage and management functionality
 */
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Palette]), PalettesInitializationModule],
  controllers: [PalettesController],
  providers: [PalettesService],
  exports: [PalettesService, TypeOrmModule],
})
export class PalettesModule {}
