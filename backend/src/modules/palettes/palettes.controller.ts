import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { PalettesService } from './palettes.service';
import { CreatePaletteDto } from './dto/create-palette.dto';
import { UpdatePaletteDto } from './dto/update-palette.dto';
import { ListPalettesDto } from './dto/list-palettes.dto';

/**
 * Controller for managing color palettes
 */
@Controller('palettes')
export class PalettesController {
  constructor(private readonly palettesService: PalettesService) {}

  /**
   * Get paginated list of palettes
   */
  @Get()
  async listPalettes(@Query() dto: ListPalettesDto) {
    return await this.palettesService.listPalettes(dto);
  }

  /**
   * Get palette by ID
   */
  @Get(':id')
  async getPaletteById(@Param('id') id: string) {
    const palette = await this.palettesService.getPaletteById(id);
    return { palette };
  }

  /**
   * Create a new palette
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPalette(@Body() createPaletteDto: CreatePaletteDto) {
    const palette = await this.palettesService.createPalette(
      createPaletteDto.name,
      createPaletteDto.key,
      createPaletteDto.primaryColor,
      createPaletteDto.foreignColor,
    );
    return { palette };
  }

  /**
   * Update a palette
   */
  @Put(':id')
  async updatePalette(@Param('id') id: string, @Body() updatePaletteDto: UpdatePaletteDto) {
    const palette = await this.palettesService.updatePalette(id, updatePaletteDto);
    return { palette };
  }

  /**
   * Delete a palette
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePalette(@Param('id') id: string) {
    await this.palettesService.deletePalette(id);
  }
}
