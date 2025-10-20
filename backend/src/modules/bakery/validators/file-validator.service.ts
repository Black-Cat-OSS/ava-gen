import { Injectable, Logger } from '@nestjs/common';
import { AVATAR_CONSTANTS } from '../utils/constants';
import { 
  FileValidationException, 
  InvalidFileSizeException, 
  CorruptedFileException 
} from '../exceptions/bakery.exception';

/**
 * Validates file integrity and format
 */
@Injectable()
export class FileValidatorService {
  private readonly logger = new Logger(FileValidatorService.name);

  async validate(file: Buffer): Promise<boolean> {
    this.logger.log('Validating file integrity');

    try {
      // Check if file is not empty
      if (file.length === 0) {
        throw new FileValidationException('File is empty');
      }

      // Check file size
      if (!this.isValidFileSize(file)) {
        throw new InvalidFileSizeException(
          file.length, 
          AVATAR_CONSTANTS.FILE_LIMITS.MIN_SIZE, 
          AVATAR_CONSTANTS.FILE_LIMITS.MAX_SIZE
        );
      }

      // Check if file can be parsed (basic format validation)
      if (!this.canBeParsed(file)) {
        throw new CorruptedFileException('File cannot be parsed or has invalid format');
      }

      this.logger.log('File validation passed');
      return true;

    } catch (error) {
      if (error instanceof FileValidationException || 
          error instanceof InvalidFileSizeException || 
          error instanceof CorruptedFileException) {
        throw error;
      }
      
      this.logger.error(`File validation failed: ${error.message}`);
      throw new FileValidationException(error.message);
    }
  }

  private isValidFileSize(file: Buffer): boolean {
    const size = file.length;
    return size >= AVATAR_CONSTANTS.FILE_LIMITS.MIN_SIZE && 
           size <= AVATAR_CONSTANTS.FILE_LIMITS.MAX_SIZE;
  }

  private canBeParsed(file: Buffer): boolean {
    try {
      // Try to parse as JSON first
      const content = file.toString('utf8');
      if (content.startsWith('{')) {
        JSON.parse(content);
        return true;
      }

      // Try to parse as binary format
      if (content.includes(AVATAR_CONSTANTS.MAGIC_NUMBERS.AVATAR_BINARY)) {
        return true;
      }

      // Try to parse as compressed format
      if (content.includes(AVATAR_CONSTANTS.MAGIC_NUMBERS.COMPRESSED)) {
        return true;
      }

      return false;

    } catch {
      return false;
    }
  }
}
