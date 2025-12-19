import { IsString, IsHexColor, Length, Matches } from 'class-validator';

export class CreatePaletteDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @Length(1, 50)
  @Matches(/^[a-z0-9-]+$/, { message: 'Key must contain only lowercase letters, numbers, and hyphens' })
  key: string;

  @IsString()
  @IsHexColor()
  primaryColor: string;

  @IsString()
  @IsHexColor()
  foreignColor: string;
}
