import { Logger } from '@nestjs/common';
import type { ColorScheme } from '../../../common/interfaces/avatar-object.interface';
import type { PalettesService } from '../../../modules/palettes';

export interface ResolvedColors {
  primaryColor?: string;
  foreignColor?: string;
}

export async function initializeColorSchemes(
  palettesService: PalettesService,
  logger: Logger,
): Promise<ColorScheme[]> {
  try {
    const colorSchemes = await palettesService.getColorSchemes();
    logger.log(`Loaded ${colorSchemes.length} color schemes from palettes service`);
    return colorSchemes;
  } catch (error) {
    logger.error(`Failed to load color schemes: ${error.message}`, error);
    return [];
  }
}

export function resolveColorScheme(
  colorSchemes: ColorScheme[],
  colorScheme?: string,
  primaryColor?: string,
  foreignColor?: string,
): ResolvedColors {
  let finalPrimaryColor = primaryColor;
  let finalForeignColor = foreignColor;

  if (colorScheme) {
    const scheme = colorSchemes.find(s => s.name === colorScheme);
    if (scheme) {
      finalPrimaryColor = scheme.primaryColor;
      finalForeignColor = scheme.foreignColor;
    }
  }

  return {
    primaryColor: finalPrimaryColor,
    foreignColor: finalForeignColor,
  };
}
