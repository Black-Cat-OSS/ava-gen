import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Palette } from './palette.entity';
import { COLOR_PALETTES } from './constants/color-schemes.constants';
import { ColorScheme } from '../../common/interfaces/avatar-object.interface';

/**
 * Service for managing color palettes
 */
@Injectable()
export class PalettesService {
  private readonly logger = new Logger(PalettesService.name);

  constructor(
    @InjectRepository(Palette)
    private readonly paletteRepository: Repository<Palette>,
  ) {}

  /**
   * Get paginated list of palettes
   */
  async listPalettes(pick?: number, offset?: number) {
    this.logger.log('Retrieving palette list with pagination');

    const limit = pick || 10;
    const skip = offset || 0;

    const [palettes, total] = await this.paletteRepository.findAndCount({
      take: limit,
      skip: skip,
      order: {
        createdAt: 'ASC',
      },
    });

    this.logger.log(`Retrieved ${palettes.length} palettes from ${skip} offset`);

    return {
      items: palettes,
      pagination: {
        total,
        offset: skip,
        pick: limit,
        hasMore: skip + limit < total,
      },
    };
  }

  /**
   * Get palette by key
   */
  async getPaletteByKey(key: string): Promise<Palette | null> {
    this.logger.log(`Getting palette by key: ${key}`);
    return await this.paletteRepository.findOne({
      where: { key },
    });
  }

  /**
   * Get palette by ID
   */
  async getPaletteById(id: string): Promise<Palette> {
    this.logger.log(`Getting palette by ID: ${id}`);
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new NotFoundException(`Invalid palette ID format: ${id}`);
    }
    
    const palette = await this.paletteRepository.findOne({
      where: { id },
    });

    if (!palette) {
      throw new NotFoundException(`Palette with id ${id} not found`);
    }

    return palette;
  }

  /**
   * Seed palettes from constants if database is empty
   */
  async seedPalettes(): Promise<void> {
    this.logger.log('Checking if palettes need to be seeded');

    const count = await this.paletteRepository.count();
    if (count > 0) {
      this.logger.log(`Database already has ${count} palettes, skipping seed`);
      return;
    }

    this.logger.log('Seeding palettes from constants');

    const palettesToSeed = COLOR_PALETTES.map((palette) =>
      this.paletteRepository.create({
        name: palette.name,
        key: palette.key,
        primaryColor: palette.primaryColor,
        foreignColor: palette.foreignColor,
      }),
    );

    await this.paletteRepository.save(palettesToSeed);
    this.logger.log(`Seeded ${palettesToSeed.length} palettes`);
  }

  /**
   * Get palettes in ColorScheme format for generators
   */
  async getColorSchemes(): Promise<ColorScheme[]> {
    this.logger.log('Getting color schemes');
    const palettes = await this.paletteRepository.find({
      order: { createdAt: 'ASC' },
    });

    return palettes.map((palette) => ({
      name: palette.key,
      primaryColor: palette.primaryColor,
      foreignColor: palette.foreignColor,
    }));
  }

  /**
   * Create a new palette
   */
  async createPalette(
    name: string,
    key: string,
    primaryColor: string,
    foreignColor: string,
  ): Promise<Palette> {
    this.logger.log(`Creating palette: ${name}`);

    const palette = this.paletteRepository.create({
      name,
      key,
      primaryColor,
      foreignColor,
    });

    return await this.paletteRepository.save(palette);
  }

  /**
   * Update an existing palette
   */
  async updatePalette(id: string, updateData: Partial<Palette>): Promise<Palette> {
    this.logger.log(`Updating palette: ${id}`);

    const palette = await this.paletteRepository.findOne({
      where: { id },
    });

    if (!palette) {
      throw new NotFoundException(`Palette with id ${id} not found`);
    }

    Object.assign(palette, updateData);
    return await this.paletteRepository.save(palette);
  }

  /**
   * Delete a palette
   */
  async deletePalette(id: string): Promise<void> {
    this.logger.log(`Deleting palette: ${id}`);

    const palette = await this.paletteRepository.findOne({
      where: { id },
    });

    if (!palette) {
      throw new NotFoundException(`Palette with id ${id} not found`);
    }

    await this.paletteRepository.remove(palette);
  }
}
