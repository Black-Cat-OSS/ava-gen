import type { AvatarObject } from '../../../common/interfaces/avatar-object.interface';
import type { AvatarSizeKey } from './avatar-sizes.util';

export function createAvatarObject(
  id: string,
  createdAt: Date,
  imageBuffers: Record<AvatarSizeKey, Buffer>,
  metaDataPayload?: Record<string, unknown>,
): AvatarObject {
  return {
    meta_data_name: id,
    meta_data_created_at: createdAt,
    meta_data_payload: metaDataPayload,
    image_4n: imageBuffers.image_4n,
    image_5n: imageBuffers.image_5n,
    image_6n: imageBuffers.image_6n,
    image_7n: imageBuffers.image_7n,
    image_8n: imageBuffers.image_8n,
    image_9n: imageBuffers.image_9n,
  };
}
