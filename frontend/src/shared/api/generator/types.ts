export type EmojiSize = 'small' | 'medium' | 'large';
export type BackgroundType = 'solid' | 'linear' | 'radial';
export type GeneratorType = 'pixelize' | 'wave' | 'emoji';

export interface BaseGenerateParams {
  primaryColor?: string;
  foreignColor?: string;
  colorScheme?: string;
}

export interface GenerateAvatarParams extends BaseGenerateParams {
  seed?: string;
}

export interface GenerateAvatarResponse extends BaseGenerateParams {
  id: string;
  name: string;
  filePath: string;
  createdAt: string;
  version: string;
  generatorType?: string;
}

export interface GenerateEmojiAvatarParams extends BaseGenerateParams {
  emoji: string;
  backgroundType: BackgroundType;
  angle?: number;
  emojiSize?: EmojiSize;
}

export type GenerateAvatarProcedural = GenerateAvatarParams & { type: GeneratorType };
export type GenerateAvatarAngular = GenerateAvatarParams & { angle: number };
