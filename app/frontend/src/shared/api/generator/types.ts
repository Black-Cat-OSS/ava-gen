export type EmojiSize = 'small' | 'medium' | 'large';
export type BackgroundType = 'solid' | 'linear' | 'radial';
export type GeneratorType = 'pixelize' | 'wave' | 'emoji' | 'gradient' | 'lowpoly';
export type PointDensity = 'low' | 'medium' | 'high';

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

export interface GenerateEmojiAvatarParams {
  emoji: string;
  backgroundType: BackgroundType;
  primaryColor?: string;
  foreignColor?: string;
  angle?: number;
  emojiSize?: EmojiSize;
}

export interface GenerateLowpolyAvatarParams {
  emoji?: string;
  backgroundType: BackgroundType;
  primaryColor?: string;
  foreignColor?: string;
  colorScheme?: string;
  angle?: number;
  pointDensity?: PointDensity;
  colorVariation?: number;
  edgeDetection?: boolean;
  emojiSize?: EmojiSize;
}

export type GenerateAvatarProcedural = GenerateAvatarParams & {
  type: GeneratorType;
  seed: string;
};
export type GenerateAvatarAngular = GenerateAvatarParams & { angle: number };
