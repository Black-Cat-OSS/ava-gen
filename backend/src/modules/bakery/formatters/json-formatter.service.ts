import { Injectable, Logger } from '@nestjs/common';
import { IFileFormatter, BakingOptions, UnbakingOptions } from '../interfaces/formatter.interface';
import { AvatarObject } from '../types/avatar-object.type';
import { FileFormat, FileStructure } from '../types/file-format.type';
import { BufferUtils } from '../utils/buffer.utils';
import { AVATAR_CONSTANTS } from '../utils/constants';

/**
 * JSON formatter for avatar objects
 * Serializes AvatarObject to JSON with base64 buffers
 */
@Injectable()
export class JsonFormatterService implements IFileFormatter {
  private readonly logger = new Logger(JsonFormatterService.name);

  supportedFormat(): FileFormat {
    return 'json';
  }

  async bake(avatarObject: AvatarObject, _options: BakingOptions): Promise<Buffer> {
    this.logger.log('Baking object to JSON format');

    // Create file structure
    const fileStructure: FileStructure = {
      header: {
        version: AVATAR_CONSTANTS.VERSIONS.CURRENT,
        type: 'avatar-object',
        createdAt: new Date().toISOString(),
        objectId: avatarObject.metadata.id,
        templateId: avatarObject.template_id,
        format: 'json',
      },
      
      metadata: avatarObject.metadata,
      
      bufferCounts: {
        originalImages: 6,
        filteredImages: BufferUtils.countFilteredImages(avatarObject.filtered_images),
      },
      
      buffers: {
        original: {
          image_4n: BufferUtils.bufferToBase64(avatarObject.images.image_4n),
          image_5n: BufferUtils.bufferToBase64(avatarObject.images.image_5n),
          image_6n: BufferUtils.bufferToBase64(avatarObject.images.image_6n),
          image_7n: BufferUtils.bufferToBase64(avatarObject.images.image_7n),
          image_8n: BufferUtils.bufferToBase64(avatarObject.images.image_8n),
          image_9n: BufferUtils.bufferToBase64(avatarObject.images.image_9n),
        },
        
        filtered: this.convertFilteredImages(avatarObject.filtered_images),
      },
      
      payload: avatarObject.payload,
      
      buildInfo: {
        stages: avatarObject.build_stages,
        totalSize: BufferUtils.calculateTotalSize(avatarObject.images),
        bakedAt: new Date().toISOString(),
      },
    };

    // Serialize to JSON
    const jsonString = JSON.stringify(fileStructure, null, 2);
    
    return Buffer.from(jsonString, 'utf8');
  }

  async unbake(file: Buffer, _options: UnbakingOptions): Promise<AvatarObject> {
    this.logger.log('Unbaking JSON file to object');

    try {
      const fileStructure: FileStructure = JSON.parse(file.toString('utf8'));

      // Restore object
      const avatarObject: AvatarObject = {
        template_id: fileStructure.header.templateId,
        build_stages: fileStructure.buildInfo.stages,
        
        images: {
          image_4n: BufferUtils.base64ToBuffer(fileStructure.buffers.original.image_4n),
          image_5n: BufferUtils.base64ToBuffer(fileStructure.buffers.original.image_5n),
          image_6n: BufferUtils.base64ToBuffer(fileStructure.buffers.original.image_6n),
          image_7n: BufferUtils.base64ToBuffer(fileStructure.buffers.original.image_7n),
          image_8n: BufferUtils.base64ToBuffer(fileStructure.buffers.original.image_8n),
          image_9n: BufferUtils.base64ToBuffer(fileStructure.buffers.original.image_9n),
        },
        
        filtered_images: this.restoreFilteredImages(fileStructure.buffers.filtered),
        
        payload: fileStructure.payload,
        
        metadata: fileStructure.metadata,
      };

      return avatarObject;

    } catch (error) {
      throw new Error(`Error unbaking JSON file: ${error.message}`);
    }
  }

  private convertFilteredImages(filteredImages?: {
    [size: number]: {
      [filterType: string]: Buffer;
    };
  }): Record<string, Record<string, string>> {
    if (!filteredImages) return {};
    
    const result: Record<string, Record<string, string>> = {};
    for (const [size, images] of Object.entries(filteredImages)) {
      result[size] = {};
      for (const [filter, buffer] of Object.entries(images)) {
        result[size][filter] = BufferUtils.bufferToBase64(buffer);
      }
    }
    return result;
  }

  private restoreFilteredImages(filtered: Record<string, Record<string, string>>): {
    [size: number]: {
      [filterType: string]: Buffer;
    };
  } {
    const result: {
      [size: number]: {
        [filterType: string]: Buffer;
      };
    } = {};
    
    for (const [size, images] of Object.entries(filtered)) {
      result[parseInt(size)] = {};
      for (const [filter, base64] of Object.entries(images)) {
        result[parseInt(size)][filter] = BufferUtils.base64ToBuffer(base64 as string);
      }
    }
    
    return result;
  }
}
