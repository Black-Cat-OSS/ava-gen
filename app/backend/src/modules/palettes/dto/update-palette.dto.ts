import { IsOptional, IsString, IsHexColor, Length, Matches } from 'class-validator';

export class UpdatePaletteDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Matches(/^[a-z0-9-]+$/, { message: 'Key must contain only lowercase letters, numbers, and hyphens' })
  key?: string;

  @IsOptional()
  @IsString()
  @IsHexColor()
  primaryColor?: string;

  @IsOptional()
  @IsString()
  @IsHexColor()
  foreignColor?: string;
}
