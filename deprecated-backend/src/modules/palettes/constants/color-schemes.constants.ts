/**
 * Color palettes for avatar generation
 * All colors are in hex format for consistency
 */

export interface ColorPaletteInput {
  name: string;
  key: string;
  primaryColor: string;
  foreignColor: string;
}

export const COLOR_PALETTES: ColorPaletteInput[] = [
  {
    name: 'Green',
    key: 'green',
    primaryColor: '#22C55E',
    foreignColor: '#86EFAC',
  },
  {
    name: 'Blue',
    key: 'blue',
    primaryColor: '#3B82F6',
    foreignColor: '#60A5FA',
  },
  {
    name: 'Red',
    key: 'red',
    primaryColor: '#EF4444',
    foreignColor: '#F472B6',
  },
  {
    name: 'Orange',
    key: 'orange',
    primaryColor: '#F97316',
    foreignColor: '#FDE047',
  },
  {
    name: 'Purple',
    key: 'purple',
    primaryColor: '#A855F7',
    foreignColor: '#C084FC',
  },
  {
    name: 'Teal',
    key: 'teal',
    primaryColor: '#14B8A6',
    foreignColor: '#06B6D4',
  },
  {
    name: 'Indigo',
    key: 'indigo',
    primaryColor: '#6366F1',
    foreignColor: '#3B82F6',
  },
  {
    name: 'Pink',
    key: 'pink',
    primaryColor: '#F472B6',
    foreignColor: '#F43F5E',
  },
  {
    name: 'Emerald',
    key: 'emerald',
    primaryColor: '#10B981',
    foreignColor: '#22C55E',
  },
  {
    name: 'Default',
    key: 'default',
    primaryColor: '#3b82f6',
    foreignColor: '#ef4444',
  },
  {
    name: 'Monochrome',
    key: 'monochrome',
    primaryColor: '#333333',
    foreignColor: '#666666',
  },
  {
    name: 'Vibrant',
    key: 'vibrant',
    primaryColor: '#FF6B35',
    foreignColor: '#F7931E',
  },
  {
    name: 'Pastel',
    key: 'pastel',
    primaryColor: '#FFB3BA',
    foreignColor: '#FFDFBA',
  },
  {
    name: 'Ocean',
    key: 'ocean',
    primaryColor: '#0077BE',
    foreignColor: '#00A8CC',
  },
  {
    name: 'Sunset',
    key: 'sunset',
    primaryColor: '#FF8C42',
    foreignColor: '#FF6B35',
  },
  {
    name: 'Forest',
    key: 'forest',
    primaryColor: '#2E8B57',
    foreignColor: '#32CD32',
  },
  {
    name: 'Royal',
    key: 'royal',
    primaryColor: '#6A0DAD',
    foreignColor: '#8A2BE2',
  },
];

/**
 * Named colors mapping for compatibility with old color names
 */
export const NAMED_COLORS: { [key: string]: string } = {
  green: '#22C55E',
  lightgreen: '#86EFAC',
  blue: '#3B82F6',
  lightblue: '#60A5FA',
  red: '#EF4444',
  pink: '#F472B6',
  purple: '#A855F7',
  violet: '#C084FC',
  orange: '#F97316',
  yellow: '#FDE047',
  teal: '#14B8A6',
  cyan: '#06B6D4',
  indigo: '#6366F1',
  rose: '#F43F5E',
  emerald: '#10B981',
};
