import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsEnum,
  Matches,
  MaxLength,
  IsBoolean,
} from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * DTO для генерации lowpoly аватара с градиентами или эмодзи (API v4)
 *
 * Объединяет возможности v2 (градиенты) и v3 (эмодзи) с добавлением lowpoly эффекта.
 * Позволяет создавать lowpoly аватары с градиентным фоном или с эмодзи на градиентном фоне.
 *
 * @class GenerateAvatarV4Dto
 */
export class GenerateAvatarV4Dto {
  @ApiPropertyOptional({
    description: 'Unicode emoji character (optional, for emoji+lowpoly combination)',
    example: '😀',
    maxLength: 20,
  })
  @IsOptional()
  @IsString({ message: 'Emoji must be a string' })
  @MaxLength(20, { message: 'Emoji must not exceed 20 characters' })
  emoji?: string;

  @ApiProperty({
    description: 'Background type for the avatar',
    enum: ['solid', 'linear', 'radial'],
    example: 'linear',
  })
  @IsEnum(['solid', 'linear', 'radial'], {
    message: 'Background type must be one of: solid, linear, radial',
  })
  backgroundType: 'solid' | 'linear' | 'radial';

  @ApiPropertyOptional({
    description: 'Primary color for background generation (hex format)',
    example: '#3B82F6',
    pattern: '^#[0-9A-Fa-f]{6}$',
  })
  @IsOptional()
  @IsString({ message: 'Primary color must be a string' })
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Primary color must be a valid hex color (e.g., #3B82F6)',
  })
  primaryColor?: string;

  @ApiPropertyOptional({
    description: 'Secondary color for gradient backgrounds (hex format)',
    example: '#EF4444',
    pattern: '^#[0-9A-Fa-f]{6}$',
  })
  @IsOptional()
  @IsString({ message: 'Foreign color must be a string' })
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Foreign color must be a valid hex color (e.g., #EF4444)',
  })
  foreignColor?: string;

  @ApiPropertyOptional({
    description: 'Color scheme name (alternative to primaryColor/foreignColor)',
    example: 'ocean',
  })
  @IsOptional()
  @IsString({ message: 'Color scheme must be a string' })
  colorScheme?: string;

  @ApiPropertyOptional({
    description: 'Gradient angle in degrees (0-360, for linear/radial backgrounds)',
    minimum: 0,
    maximum: 360,
    example: 90,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Angle must be a number' })
  @Min(0, { message: 'Angle must be at least 0 degrees' })
  @Max(360, { message: 'Angle must not exceed 360 degrees' })
  angle?: number;

  @ApiPropertyOptional({
    description: 'Point density for lowpoly triangulation',
    enum: ['low', 'medium', 'high'],
    example: 'medium',
    default: 'medium',
  })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'], {
    message: 'Point density must be one of: low, medium, high',
  })
  pointDensity?: 'low' | 'medium' | 'high';

  @ApiPropertyOptional({
    description: 'Color variation percentage for lowpoly effect (0-100)',
    minimum: 0,
    maximum: 100,
    example: 10,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Color variation must be a number' })
  @Min(0, { message: 'Color variation must be at least 0' })
  @Max(100, { message: 'Color variation must not exceed 100' })
  colorVariation?: number;

  @ApiPropertyOptional({
    description: 'Enable edge detection for lowpoly triangulation',
    example: true,
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'Edge detection must be a boolean' })
  edgeDetection?: boolean;

  @ApiPropertyOptional({
    description: 'Size of the emoji relative to avatar (only when emoji is provided)',
    enum: ['small', 'medium', 'large'],
    example: 'large',
    default: 'large',
  })
  @IsOptional()
  @IsEnum(['small', 'medium', 'large'], {
    message: 'Emoji size must be one of: small, medium, large',
  })
  emojiSize?: 'small' | 'medium' | 'large';
}
