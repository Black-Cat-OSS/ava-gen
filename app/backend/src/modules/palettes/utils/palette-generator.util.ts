import { ColorScheme } from '../../../common/interfaces/avatar-object.interface';

/**
 * Generate complementary color palette (opposite colors on color wheel)
 */
export function generateComplementaryPalette(): ColorScheme {
  const hue = Math.random() * 360;
  const complementaryHue = (hue + 180) % 360;

  const saturation1 = 70 + Math.random() * 20;
  const lightness1 = 45 + Math.random() * 15;

  const saturation2 = 70 + Math.random() * 20;
  const lightness2 = 45 + Math.random() * 15;

  const primaryColor = hslToHex(hue, saturation1, lightness1);
  const foreignColor = hslToHex(complementaryHue, saturation2, lightness2);

  return {
    name: 'complementary',
    primaryColor,
    foreignColor,
  };
}

/**
 * Generate analogous color palette (neighboring colors on color wheel)
 */
export function generateAnalogousPalette(): ColorScheme {
  const baseHue = Math.random() * 360;
  const offset = 30 + Math.random() * 30;

  const primaryColor = hslToHex(baseHue, 70 + Math.random() * 20, 45 + Math.random() * 15);
  const foreignColor = hslToHex((baseHue + offset) % 360, 70 + Math.random() * 20, 45 + Math.random() * 15);

  return {
    name: 'analogous',
    primaryColor,
    foreignColor,
  };
}

/**
 * Generate monochromatic color palette (different shades of same hue)
 */
export function generateMonochromaticPalette(): ColorScheme {
  const hue = Math.random() * 360;
  const saturation = 60 + Math.random() * 30;
  const lightness1 = 35 + Math.random() * 20;
  const lightness2 = 55 + Math.random() * 25;

  const primaryColor = hslToHex(hue, saturation, lightness1);
  const foreignColor = hslToHex(hue, saturation, lightness2);

  return {
    name: 'monochromatic',
    primaryColor,
    foreignColor,
  };
}

/**
 * Generate split-complementary color palette
 */
export function generateSplitComplementaryPalette(): ColorScheme {
  const hue = Math.random() * 360;
  const offset1 = 150 + Math.random() * 20;

  const saturation1 = 70 + Math.random() * 20;
  const lightness1 = 45 + Math.random() * 15;

  const saturation2 = 70 + Math.random() * 20;
  const lightness2 = 45 + Math.random() * 15;

  const primaryColor = hslToHex(hue, saturation1, lightness1);
  const foreignColor = hslToHex((hue + offset1) % 360, saturation2, lightness2);

  return {
    name: 'split-complementary',
    primaryColor,
    foreignColor,
  };
}

/**
 * Generate random palette of specified type
 */
export function generateRandomPalette(type?: string): ColorScheme {
  switch (type) {
    case 'complementary':
      return generateComplementaryPalette();
    case 'analogous':
      return generateAnalogousPalette();
    case 'monochromatic':
      return generateMonochromaticPalette();
    case 'split-complementary':
      return generateSplitComplementaryPalette();
    default: {
      const types = ['complementary', 'analogous', 'monochromatic', 'split-complementary'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      return generateRandomPalette(randomType);
    }
  }
}

/**
 * Calculate contrast ratio between two colors (WCAG standard)
 */
export function calculateContrast(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get relative luminance of a color (WCAG formula)
 */
function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  const rsrgb = rgb.r / 255;
  const gsrgb = rgb.g / 255;
  const bsrgb = rgb.b / 255;

  const r = rsrgb <= 0.03928 ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4);
  const g = gsrgb <= 0.03928 ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4);
  const b = bsrgb <= 0.03928 ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Convert HSL to hex color
 */
function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 1 / 6) {
    r = c;
    g = x;
    b = 0;
  } else if (1 / 6 <= h && h < 2 / 6) {
    r = x;
    g = c;
    b = 0;
  } else if (2 / 6 <= h && h < 3 / 6) {
    r = 0;
    g = c;
    b = x;
  } else if (3 / 6 <= h && h < 4 / 6) {
    r = 0;
    g = x;
    b = c;
  } else if (4 / 6 <= h && h < 5 / 6) {
    r = x;
    g = 0;
    b = c;
  } else if (5 / 6 <= h && h < 1) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
}

/**
 * Convert hex to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return { r: 0, g: 0, b: 0 };
  }

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}
