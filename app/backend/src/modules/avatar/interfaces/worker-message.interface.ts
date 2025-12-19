export interface BaseWorkerMessage {
  type: string;
  taskId: string;
}

export interface PixelizeWorkerMessage extends BaseWorkerMessage {
  type: 'pixelize';
  size: number;
  primaryColor?: string;
  foreignColor?: string;
  seed: string;
}

export interface WaveWorkerMessage extends BaseWorkerMessage {
  type: 'wave';
  size: number;
  primaryColor?: string;
  foreignColor?: string;
  seed: string;
}

export interface GradientWorkerMessage extends BaseWorkerMessage {
  type: 'gradient';
  size: number;
  primaryColor?: string;
  foreignColor?: string;
  angle?: number;
}

export interface EmojiWorkerMessage extends BaseWorkerMessage {
  type: 'emoji';
  size: number;
  primaryColor?: string;
  foreignColor?: string;
  emoji: string;
  backgroundType: 'solid' | 'linear' | 'radial';
  emojiSize: 'small' | 'medium' | 'large';
  angle?: number;
}

export type WorkerMessage =
  | PixelizeWorkerMessage
  | WaveWorkerMessage
  | GradientWorkerMessage
  | EmojiWorkerMessage;

export interface WorkerResponse {
  taskId: string;
  success: boolean;
  buffer?: Buffer;
  error?: string;
}
