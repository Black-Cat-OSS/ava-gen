import { IsOptional, IsString, MaxLength, IsEnum, IsNumber, Min, Max, IsBoolean } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { FilterType } from '../../../common/enums/filter.enum';
import { PaginationDto } from '../../../common/dto/pagination.dto';

//TODO separate to files
export class GenerateAvatarDto {
  @ApiPropertyOptional({ description: 'Primary color for avatar generation' })
  @IsOptional()
  @IsString()
  primaryColor?: string;

  @ApiPropertyOptional({ description: 'Foreign color for avatar generation' })
  @IsOptional()
  @IsString()
  foreignColor?: string;

  @ApiPropertyOptional({ description: 'Color scheme name' })
  @IsOptional()
  @IsString()
  colorScheme?: string;

  @ApiPropertyOptional({
    description: 'Generation type (pixelize, wave, gradient, emoji, lowpoly)',
    example: 'pixelize',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: 'Seed phrase for avatar generation (required, max 255 characters)',
    maxLength: 255,
    example: 'my-unique-seed-phrase',
  })
  @IsString()
  @MaxLength(255, { message: 'Seed must not exceed 255 characters' })
  seed: string;

  @ApiPropertyOptional({
    description: 'Gradient angle in degrees (0-360) - used for gradient and lowpoly types',
    minimum: 0,
    maximum: 360,
    example: 90,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(360)
  angle?: number;

  @ApiPropertyOptional({
    description: 'Point density for lowpoly generation',
    enum: ['low', 'medium', 'high'],
    example: 'medium',
  })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  pointDensity?: 'low' | 'medium' | 'high';

  @ApiPropertyOptional({
    description: 'Color variation percentage for lowpoly (0-100)',
    minimum: 0,
    maximum: 100,
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  colorVariation?: number;

  @ApiPropertyOptional({
    description: 'Enable edge detection for lowpoly generation',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  edgeDetection?: boolean;
}

export class GetAvatarDto {
  @ApiPropertyOptional({
    description: 'Filter to apply to the image',
    enum: FilterType,
    example: FilterType.GRAYSCALE,
  })
  @IsOptional()
  @IsEnum(FilterType)
  filter?: FilterType;

  @ApiPropertyOptional({
    description: 'Size parameter (2^n where 4 <= n <= 9)',
    minimum: 4,
    maximum: 9,
    example: 6,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(4)
  @Max(9)
  size?: number;
}

export class ListAvatarsDto extends PaginationDto {}
