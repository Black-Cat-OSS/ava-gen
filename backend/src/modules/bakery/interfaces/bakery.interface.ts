import { AvatarObject } from '../types/avatar-object.type';
import { FileFormat } from '../types/file-format.type';
import { BakingOptions, UnbakingOptions } from './formatter.interface';

export interface IBakeryService {
  bakeObject(ingredients: AvatarObject, options?: BakingOptions): Promise<BakingResult>;
  unbakeFile(bread: Buffer, options?: UnbakingOptions): Promise<AvatarObject>;
  detectFormat(file: Buffer): FileFormat;
  validateObject(obj: AvatarObject): Promise<boolean>;
  validateFile(file: Buffer): Promise<boolean>;
}

export interface BakingResult {
  file: Buffer;
  size: number;
  format: FileFormat;
  objectId: string;
  templateId: string;
  bakedAt: Date;
  metrics: {
    bakingTime: number;
    compression: boolean;
    optimization: boolean;
  };
}
