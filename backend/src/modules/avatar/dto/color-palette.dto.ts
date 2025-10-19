import { ApiProperty } from '@nestjs/swagger';

export class ColorPaletteDto {
  @ApiProperty({ description: 'Palette name' })
  name: string;

  @ApiProperty({ description: 'Primary color in hex format' })
  primaryColor: string;

  @ApiProperty({ description: 'Foreign color in hex format' })
  foreignColor: string;

  @ApiProperty({ description: 'Unique palette key' })
  key: string;
}