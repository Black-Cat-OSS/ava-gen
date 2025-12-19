import { NAMED_COLORS } from '../constants/color-schemes.constants';
import { ColorScheme } from '../../../common/interfaces/avatar-object.interface';

/**
 * Convert named color to hex format
 *
 * @param color - Named color or hex color
 * @returns Hex color string
 */
export function convertNamedColorToHex(color: string): string {
  if (!color) {
    return '#3B82F6'; // Default blue
  }

  if (color.startsWith('#')) {
    return color;
  }

  const normalizedColor = color.toLowerCase();
  return NAMED_COLORS[normalizedColor] || '#3B82F6'; // Default to blue
}

/**
 * Check if a string is a valid hex color
 *
 * @param hex - Hex color string
 * @returns True if valid hex color
 */
export function isValidHexColor(hex: string): boolean {
  if (!hex) {
    return false;
  }

  const hexRegex = /^#([0-9A-Fa-f]{6})$/;
  return hexRegex.test(hex);
}

/**
 * Convert all colors in a ColorScheme to hex format
 *
 * @param scheme - Color scheme with potentially named colors
 * @returns Color scheme with all colors in hex format
 */
export function convertAllColorsToHex(scheme: ColorScheme): ColorScheme {
  return {
    name: scheme.name,
    primaryColor: convertNamedColorToHex(scheme.primaryColor),
    foreignColor: convertNamedColorToHex(scheme.foreignColor),
  };
}
