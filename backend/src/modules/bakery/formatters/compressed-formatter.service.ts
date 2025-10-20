import { Injectable, Logger } from '@nestjs/common';
import { gzip, gunzip } from 'zlib';
import { promisify } from 'util';
import { IFileFormatter, BakingOptions, UnbakingOptions } from '../interfaces/formatter.interface';
import { AvatarObject } from '../types/avatar-object.type';
import { FileFormat } from '../types/file-format.type';
import { BufferUtils } from '../utils/buffer.utils';
import { AVATAR_CONSTANTS } from '../utils/constants';
import { 
  BakingException, 
  UnbakingException, 
  CompressionException, 
  InvalidMagicNumberException 
} from '../exceptions/bakery.exception';

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

/**
 * Compressed formatter for avatar objects
 * Serializes AvatarObject to compressed format using gzip
 */
@Injectable()
export class CompressedFormatterService implements IFileFormatter {
  private readonly logger = new Logger(CompressedFormatterService.name);
  private readonly magicNumber = AVATAR_CONSTANTS.MAGIC_NUMBERS.COMPRESSED;

  supportedFormat(): FileFormat {
    return 'compressed';
  }

  async bake(avatarObject: AvatarObject, _options: BakingOptions): Promise<Buffer> {
    this.logger.log('Baking object to compressed format');

    try {
      // Create JSON structure first (reuse JSON formatter logic)
      const jsonStructure = this.createJsonStructure(avatarObject);
    
    // Compress the JSON data
    const compressedData = await gzipAsync(Buffer.from(jsonStructure, 'utf8'));
    
    // Create header with magic number and compression info
    const header = Buffer.from(JSON.stringify({
      magic: this.magicNumber,
      version: AVATAR_CONSTANTS.VERSIONS.CURRENT,
      compression: 'gzip',
      originalSize: jsonStructure.length,
      compressedSize: compressedData.length,
      objectId: avatarObject.metadata.id,
      templateId: avatarObject.template_id,
    }), 'utf8');
    
    // Combine header and compressed data
    const result = Buffer.concat([
      header,
      Buffer.from('\n', 'utf8'), // Separator
      compressedData,
    ]);

      this.logger.log(`Compressed format baked, original: ${jsonStructure.length} bytes, compressed: ${compressedData.length} bytes`);
      return result;
    } catch (error) {
      if (error instanceof CompressionException) {
        throw error;
      }
      throw new BakingException(`Failed to bake object to compressed format: ${error.message}`, error);
    }
  }

  async unbake(file: Buffer, _options: UnbakingOptions): Promise<AvatarObject> {
    this.logger.log('Unbaking compressed file to object');

    try {
      // Find header end (newline separator)
      const headerEnd = file.indexOf(Buffer.from('\n', 'utf8'));
      const headerBuffer = file.subarray(0, headerEnd);
      const compressedData = file.subarray(headerEnd + 1);
      
      // Parse header
      const header = JSON.parse(headerBuffer.toString('utf8'));
      
      if (header.magic !== this.magicNumber) {
        throw new InvalidMagicNumberException(this.magicNumber, header.magic);
      }
      
      // Decompress data
      const decompressedData = await gunzipAsync(compressedData);
      const jsonStructure = decompressedData.toString('utf8');
      
      // Parse JSON structure back to object
      const avatarObject = this.parseJsonStructure(jsonStructure);

      this.logger.log(`Compressed file unbaked successfully, decompressed: ${decompressedData.length} bytes`);
      return avatarObject;

    } catch (error) {
      if (error instanceof InvalidMagicNumberException) {
        throw error;
      }
      if (error.code === 'Z_DATA_ERROR' || error.code === 'Z_BUF_ERROR') {
        throw new CompressionException(`Decompression failed: ${error.message}`, error);
      }
      throw new UnbakingException(`Failed to unbake compressed file: ${error.message}`, error);
    }
  }

  private createJsonStructure(avatarObject: AvatarObject): string {
    // Reuse logic from JSON formatter
    const fileStructure = {
      header: {
        version: AVATAR_CONSTANTS.VERSIONS.CURRENT,
        type: 'avatar-object',
        createdAt: new Date().toISOString(),
        objectId: avatarObject.metadata.id,
        templateId: avatarObject.template_id,
        format: 'compressed',
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

    return JSON.stringify(fileStructure);
  }

  private parseJsonStructure(jsonStructure: string): AvatarObject {
    const fileStructure = JSON.parse(jsonStructure);

    return {
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
        result[parseInt(size)][filter] = BufferUtils.base64ToBuffer(base64);
      }
    }
    
    return result;
  }
}
