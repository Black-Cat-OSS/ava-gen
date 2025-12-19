import { Module } from '@nestjs/common';
import { PalettesInitializerService } from './palettes-initializer.service';
import { PalettesService } from '../../palettes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Palette } from '../../palette.entity';

/**
 * Module for palette initialization
 */
@Module({
  imports: [TypeOrmModule.forFeature([Palette])],
  providers: [PalettesInitializerService, PalettesService],
  exports: [PalettesInitializerService],
})
export class PalettesInitializationModule {}
