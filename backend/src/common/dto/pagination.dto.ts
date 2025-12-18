import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

/**
 * Base DTO for pagination parameters
 */
export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Number of records to retrieve (default: 10)',
    minimum: 1,
    maximum: 100,
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  pick?: number;

  @ApiPropertyOptional({
    description: 'Number of records to skip (default: 0)',
    minimum: 0,
    example: 0,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  offset?: number;
}
