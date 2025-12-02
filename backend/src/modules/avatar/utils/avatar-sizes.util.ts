export type AvatarSizeKey =
  | 'image_4n'
  | 'image_5n'
  | 'image_6n'
  | 'image_7n'
  | 'image_8n'
  | 'image_9n';

export interface AvatarSizeMapping {
  key: AvatarSizeKey;
  size: number;
}

export const AVATAR_SIZES: AvatarSizeMapping[] = [
  { key: 'image_4n', size: 16 },
  { key: 'image_5n', size: 32 },
  { key: 'image_6n', size: 64 },
  { key: 'image_7n', size: 128 },
  { key: 'image_8n', size: 256 },
  { key: 'image_9n', size: 512 },
];
