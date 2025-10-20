import { Injectable, Logger } from '@nestjs/common';
import { AvatarObject } from '../types/avatar-object.type';

/**
 * Validates AvatarObject structure and data integrity
 */
@Injectable()
export class StructureValidatorService {
  private readonly logger = new Logger(StructureValidatorService.name);

  async validate(avatarObject: AvatarObject): Promise<boolean> {
    this.logger.log('Validating avatar object structure');

    try {
      // Validate basic structure
      if (!this.hasRequiredFields(avatarObject)) {
        throw new Error('Missing required fields');
      }

      // Validate metadata
      if (!this.isValidMetadata(avatarObject.metadata)) {
        throw new Error('Invalid metadata structure');
      }

      // Validate images
      if (!this.isValidImages(avatarObject.images)) {
        throw new Error('Invalid images structure');
      }

      // Validate filtered images (if present)
      if (avatarObject.filtered_images && !this.isValidFilteredImages(avatarObject.filtered_images)) {
        throw new Error('Invalid filtered images structure');
      }

      // Validate build stages
      if (!this.isValidBuildStages(avatarObject.build_stages)) {
        throw new Error('Invalid build stages');
      }

      this.logger.log('Structure validation passed');
      return true;

    } catch (error) {
      this.logger.error(`Structure validation failed: ${error.message}`);
      return false;
    }
  }

  private hasRequiredFields(avatarObject: AvatarObject): boolean {
    return !!(
      avatarObject.template_id &&
      avatarObject.build_stages &&
      avatarObject.images &&
      avatarObject.metadata &&
      avatarObject.metadata.id &&
      avatarObject.metadata.createdAt &&
      avatarObject.metadata.version
    );
  }

  private isValidMetadata(metadata: AvatarObject['metadata']): boolean {
    return !!(
      metadata.id &&
      metadata.createdAt instanceof Date &&
      metadata.version &&
      metadata.type &&
      metadata.creationContext &&
      metadata.performanceMetrics
    );
  }

  private isValidImages(images: AvatarObject['images']): boolean {
    const requiredImages = ['image_4n', 'image_5n', 'image_6n', 'image_7n', 'image_8n', 'image_9n'];
    
    return requiredImages.every(imageKey => {
      const image = images[imageKey as keyof typeof images];
      return Buffer.isBuffer(image) && image.length > 0;
    });
  }

  private isValidFilteredImages(filteredImages: NonNullable<AvatarObject['filtered_images']>): boolean {
    for (const [size, images] of Object.entries(filteredImages)) {
      // Validate size is a number
      if (isNaN(parseInt(size))) {
        return false;
      }

      // Validate each filter image
      for (const [filter, buffer] of Object.entries(images)) {
        if (!filter || !Buffer.isBuffer(buffer) || buffer.length === 0) {
          return false;
        }
      }
    }
    
    return true;
  }

  private isValidBuildStages(buildStages: string[]): boolean {
    return Array.isArray(buildStages) && buildStages.length > 0 && 
           buildStages.every(stage => typeof stage === 'string' && stage.length > 0);
  }
}
