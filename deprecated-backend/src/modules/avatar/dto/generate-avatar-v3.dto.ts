import { IsOptional, IsString, IsNumber, Min, Max, IsNotEmpty, IsEnum, Matches, MaxLength } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

/**
 * DTO для генерации эмодзи-аватара (API v3)
 *
 * Расширяет возможности v1/v2 добавлением поддержки эмодзи с различными типами фона.
 * Использует Twemoji CDN для получения SVG эмодзи и растеризации их в PNG.
 *
 * @class GenerateAvatarV3Dto
 */
export class GenerateAvatarV3Dto {
  @ApiProperty({
    description: 'Unicode emoji character',
    example: '😀',
    maxLength: 20,
  })
  @IsNotEmpty({ message: 'Emoji is required' })
  @IsString({ message: 'Emoji must be a string' })
  @MaxLength(20, { message: 'Emoji must not exceed 20 characters' })
  emoji: string;

  @ApiProperty({
    description: 'Background type for the avatar',
    enum: ['solid', 'linear', 'radial'],
    example: 'solid',
  })
  @IsNotEmpty({ message: 'Background type is required' })
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
    description: 'Gradient angle in degrees (0-360, only for linear background)',
    minimum: 0,
    maximum: 360,
    example: 90,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Angle must be a number' })
  @Min(0, { message: 'Angle must be at least 0 degrees' })
  @Max(360, { message: 'Angle must not exceed 360 degrees' })
  angle?: number;

  @ApiPropertyOptional({
    description: 'Size of the emoji relative to avatar',
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
