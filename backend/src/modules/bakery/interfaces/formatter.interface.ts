import { AvatarObject } from '../types/avatar-object.type';
import { FileFormat } from '../types/file-format.type';

export interface IFileFormatter {
  bake(avatarObject: AvatarObject, options: BakingOptions): Promise<Buffer>;
  unbake(file: Buffer, options: UnbakingOptions): Promise<AvatarObject>;
  supportedFormat(): FileFormat;
}

export interface BakingOptions {
  format?: FileFormat;
  compression?: boolean;
  optimization?: boolean;
  includeMetadata?: boolean;
  includeFiltered?: boolean;
}

export interface UnbakingOptions {
  includeMetadata?: boolean;
  includeFiltered?: boolean;
  validation?: boolean;
}
