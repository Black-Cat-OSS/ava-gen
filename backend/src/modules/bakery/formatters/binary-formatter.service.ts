import { Injectable, Logger } from '@nestjs/common';
import { IFileFormatter, BakingOptions, UnbakingOptions } from '../interfaces/formatter.interface';
import { AvatarObject } from '../types/avatar-object.type';
import { FileFormat } from '../types/file-format.type';
// import { BufferUtils } from '../utils/buffer.utils'; // Not used in binary formatter
import { AVATAR_CONSTANTS } from '../utils/constants';

/**
 * Binary formatter for avatar objects
 * Serializes AvatarObject to binary format with header
 */
@Injectable()
export class BinaryFormatterService implements IFileFormatter {
  private readonly logger = new Logger(BinaryFormatterService.name);
  private readonly magicNumber = AVATAR_CONSTANTS.MAGIC_NUMBERS.AVATAR_BINARY;

  supportedFormat(): FileFormat {
    return 'binary';
  }

  async bake(avatarObject: AvatarObject, _options: BakingOptions): Promise<Buffer> {
    this.logger.log('Baking object to binary format');

    // Create header
    const header = this.createHeader(avatarObject);
    
    // Serialize metadata
    const metadataBuffer = this.serializeMetadata(avatarObject.metadata);
    
    // Serialize buffers
    const buffersData = this.serializeBuffers(avatarObject);
    
    // Combine all parts
    const binaryData = Buffer.concat([
      header,
      Buffer.from(metadataBuffer.length.toString(), 'utf8'), // Metadata length
      Buffer.from(':', 'utf8'), // Separator
      metadataBuffer,
      Buffer.from(':', 'utf8'), // Separator
      buffersData,
    ]);

    this.logger.log(`Binary format baked, size: ${binaryData.length} bytes`);
    return binaryData;
  }

  async unbake(file: Buffer, _options: UnbakingOptions): Promise<AvatarObject> {
    this.logger.log('Unbaking binary file to object');

    try {
      // Parse header
      const header = this.parseHeader(file);
      
      // Find metadata section
      const metadataStart = this.findMetadataStart(file);
      const metadataLength = this.parseMetadataLength(file, metadataStart);
      
      // Extract metadata
      const metadataBuffer = file.subarray(
        metadataStart + metadataLength.toString().length + 1,
        metadataStart + metadataLength.toString().length + 1 + metadataLength
      );
      
      // Parse metadata
      const metadata = this.deserializeMetadata(metadataBuffer);
      
      // Extract buffers section
      const buffersStart = metadataStart + metadataLength.toString().length + 1 + metadataLength + 1;
      const buffersData = file.subarray(buffersStart);
      
      // Parse buffers
      const { images, filtered_images } = this.deserializeBuffers(buffersData);
      
      // Reconstruct object
      const avatarObject: AvatarObject = {
        template_id: header.templateId,
        build_stages: header.buildStages,
        images,
        filtered_images,
        payload: metadata.payload,
        metadata,
      };

      this.logger.log(`Binary file unbaked successfully`);
      return avatarObject;

    } catch (error) {
      throw new Error(`Error unbaking binary file: ${error.message}`);
    }
  }

  private createHeader(avatarObject: AvatarObject): Buffer {
    const headerData = {
      magic: this.magicNumber,
      version: AVATAR_CONSTANTS.VERSIONS.CURRENT,
      objectId: avatarObject.metadata.id,
      templateId: avatarObject.template_id,
      buildStages: avatarObject.build_stages,
      createdAt: avatarObject.metadata.createdAt.toISOString(),
    };
    
    return Buffer.from(JSON.stringify(headerData), 'utf8');
  }

  private parseHeader(file: Buffer): {
    objectId: string;
    templateId: string;
    buildStages: string[];
    createdAt: string;
  } {
    const headerEnd = file.indexOf(Buffer.from(':', 'utf8'));
    const headerBuffer = file.subarray(0, headerEnd);
    const headerJson = headerBuffer.toString('utf8');
    const header = JSON.parse(headerJson);
    
    if (header.magic !== this.magicNumber) {
      throw new Error('Invalid magic number in binary file');
    }
    
    return header;
  }

  private findMetadataStart(file: Buffer): number {
    // Find the first ':' separator after header
    const firstColon = file.indexOf(Buffer.from(':', 'utf8'));
    return firstColon + 1;
  }

  private parseMetadataLength(file: Buffer, start: number): number {
    const lengthEnd = file.indexOf(Buffer.from(':', 'utf8'), start);
    const lengthStr = file.subarray(start, lengthEnd).toString('utf8');
    return parseInt(lengthStr, 10);
  }

  private serializeMetadata(metadata: Record<string, unknown>): Buffer {
    return Buffer.from(JSON.stringify(metadata), 'utf8');
  }

  private deserializeMetadata(metadataBuffer: Buffer): Record<string, unknown> {
    return JSON.parse(metadataBuffer.toString('utf8'));
  }

  private serializeBuffers(avatarObject: AvatarObject): Buffer {
    const buffers: Buffer[] = [];
    
    // Original images
    buffers.push(avatarObject.images.image_4n);
    buffers.push(avatarObject.images.image_5n);
    buffers.push(avatarObject.images.image_6n);
    buffers.push(avatarObject.images.image_7n);
    buffers.push(avatarObject.images.image_8n);
    buffers.push(avatarObject.images.image_9n);
    
    // Filtered images (if any)
    if (avatarObject.filtered_images) {
      for (const [size, images] of Object.entries(avatarObject.filtered_images)) {
        buffers.push(Buffer.from(size, 'utf8')); // Size marker
        for (const [filter, buffer] of Object.entries(images)) {
          buffers.push(Buffer.from(filter, 'utf8')); // Filter marker
          buffers.push(buffer);
        }
      }
    }
    
    // Join with separators
    const separator = Buffer.from('|', 'utf8');
    return Buffer.concat(buffers.map((buf, index) => 
      index === 0 ? buf : Buffer.concat([separator, buf])
    ));
  }

  private deserializeBuffers(buffersData: Buffer): {
    images: {
      image_4n: Buffer;
      image_5n: Buffer;
      image_6n: Buffer;
      image_7n: Buffer;
      image_8n: Buffer;
      image_9n: Buffer;
    };
    filtered_images?: {
      [size: number]: {
        [filterType: string]: Buffer;
      };
    };
  } {
    const parts = buffersData.toString('utf8').split('|');
    
    // First 6 parts are original images
    const images = {
      image_4n: Buffer.from(parts[0], 'base64'),
      image_5n: Buffer.from(parts[1], 'base64'),
      image_6n: Buffer.from(parts[2], 'base64'),
      image_7n: Buffer.from(parts[3], 'base64'),
      image_8n: Buffer.from(parts[4], 'base64'),
      image_9n: Buffer.from(parts[5], 'base64'),
    };
    
    // Remaining parts are filtered images
    const filtered_images: {
      [size: number]: {
        [filterType: string]: Buffer;
      };
    } = {};
    
    let currentSize = '';
    for (let i = 6; i < parts.length; i++) {
      const part = parts[i];
      if (part.match(/^\d+$/)) {
        // This is a size marker
        currentSize = part;
        filtered_images[parseInt(currentSize)] = {};
      } else if (currentSize && !part.match(/^\d+$/)) {
        // This is a filter buffer
        const filterName = part.substring(0, part.indexOf(':'));
        const bufferData = part.substring(part.indexOf(':') + 1);
        filtered_images[parseInt(currentSize)][filterName] = Buffer.from(bufferData, 'base64');
      }
    }
    
    return { images, filtered_images: Object.keys(filtered_images).length > 0 ? filtered_images : undefined };
  }
}
