/**
 * Shared utilities for buffer operations to avoid code duplication
 */
export class BufferUtils {
  /**
   * Convert Buffer to base64 string
   */
  static bufferToBase64(buffer: Buffer): string {
    return buffer.toString('base64');
  }

  /**
   * Convert base64 string to Buffer
   */
  static base64ToBuffer(base64: string): Buffer {
    return Buffer.from(base64, 'base64');
  }

  /**
   * Calculate total size of all buffers in an object
   */
  static calculateTotalSize(images: {
    image_4n: Buffer;
    image_5n: Buffer;
    image_6n: Buffer;
    image_7n: Buffer;
    image_8n: Buffer;
    image_9n: Buffer;
  }): number {
    return (
      images.image_4n.length +
      images.image_5n.length +
      images.image_6n.length +
      images.image_7n.length +
      images.image_8n.length +
      images.image_9n.length
    );
  }

  /**
   * Count filtered images
   */
  static countFilteredImages(filteredImages?: {
    [size: number]: {
      [filterType: string]: Buffer;
    };
  }): number {
    if (!filteredImages) return 0;
    
    let count = 0;
    for (const sizeImages of Object.values(filteredImages)) {
      count += Object.keys(sizeImages).length;
    }
    return count;
  }
}
