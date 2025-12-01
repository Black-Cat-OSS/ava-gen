export interface AvatarObject {
  meta_data_name: string;
  meta_data_created_at: Date;
  meta_data_payload?: Record<string, unknown>;
  image_4n: Buffer;
  image_5n: Buffer;
  image_6n: Buffer;
  image_7n: Buffer;
  image_8n: Buffer;
  image_9n: Buffer;
  lowpoly_image_4n?: Buffer;
  lowpoly_image_5n?: Buffer;
  lowpoly_image_6n?: Buffer;
  lowpoly_image_7n?: Buffer;
  lowpoly_image_8n?: Buffer;
  lowpoly_image_9n?: Buffer;
}

export interface ColorScheme {
  name: string;
  primaryColor: string;
  foreignColor: string;
}
