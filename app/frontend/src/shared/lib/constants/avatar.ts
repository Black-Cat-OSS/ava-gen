import type { ImageSizes, ImageFilters } from '../utils/image';

export const AVATAR_SIZES: Array<{ value: ImageSizes; label: string; pixels: number }> = [
  { value: 4, label: '16px', pixels: 16 },
  { value: 5, label: '32px', pixels: 32 },
  { value: 6, label: '64px', pixels: 64 },
  { value: 7, label: '128px', pixels: 128 },
  { value: 8, label: '256px', pixels: 256 },
  { value: 9, label: '512px', pixels: 512 },
];

export const AVATAR_FILTERS: Array<{ value: ImageFilters | ''; label: string }> = [
  { value: '', label: 'None' },
  { value: 'grayscale', label: 'Grayscale' },
  { value: 'sepia', label: 'Sepia' },
  { value: 'negative', label: 'Negative' },
  { value: 'lowpoly', label: 'Lowpoly' },
];

export const IMAGE_VIEW_SIZE = 512;
