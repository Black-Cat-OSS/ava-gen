export type EmojiSize = Record<'small' | 'medium' | 'large', string>;
export type BackgroundType = Record<'solid' | 'linear' | 'radial', string>;
export type GeneratorType = 'pixelize' | 'wave' | 'emoji' | 'gradient';

export interface IColorScheme {
  primaryColor?: string;
  foreignColor?: string;
  colorScheme?: string;
}

export interface GenerateAvatarParams extends IColorScheme {
  seed?: string;
}

export interface GenerateAvatarResponse extends IColorScheme {
  id: string;
  name: string;
  filePath: string;
  createdAt: string;
  version: string;
  generatorType?: string;
}

export interface GenerateEmojiAvatarParams extends IColorScheme {
  emoji: string;
  backgroundType: BackgroundType;
  angle?: number;
  emojiSize?: EmojiSize;
}

export type GenerateAvatarProcedural = GenerateAvatarParams & {
  type: GeneratorType;
  seed: string;
};
export type GenerateAvatarAngular = GenerateAvatarParams & { angle: number };
