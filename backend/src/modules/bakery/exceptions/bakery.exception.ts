import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Base exception for all Bakery-related errors
 */
export abstract class BakeryException extends HttpException {
  constructor(message: string, httpStatus: HttpStatus) {
    super(message, httpStatus);
    this.name = this.constructor.name;
  }
}

/**
 * Exception thrown when baking process fails
 */
export class BakingException extends BakeryException {
  constructor(message: string, cause?: Error) {
    super(`Baking failed: ${message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    if (cause) {
      this.cause = cause;
    }
  }
}

/**
 * Exception thrown when unbaking process fails
 */
export class UnbakingException extends BakeryException {
  constructor(message: string, cause?: Error) {
    super(`Unbaking failed: ${message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    if (cause) {
      this.cause = cause;
    }
  }
}

/**
 * Exception thrown when file format is not supported or invalid
 */
export class UnsupportedFormatException extends BakeryException {
  constructor(format: string) {
    super(`Unsupported file format: ${format}`, HttpStatus.BAD_REQUEST);
  }
}

/**
 * Exception thrown when file validation fails
 */
export class FileValidationException extends BakeryException {
  constructor(message: string) {
    super(`File validation failed: ${message}`, HttpStatus.BAD_REQUEST);
  }
}

/**
 * Exception thrown when object structure validation fails
 */
export class StructureValidationException extends BakeryException {
  constructor(message: string) {
    super(`Object structure validation failed: ${message}`, HttpStatus.BAD_REQUEST);
  }
}

/**
 * Exception thrown when file is corrupted or cannot be parsed
 */
export class CorruptedFileException extends BakeryException {
  constructor(message: string) {
    super(`Corrupted file: ${message}`, HttpStatus.BAD_REQUEST);
  }
}

/**
 * Exception thrown when file size is invalid
 */
export class InvalidFileSizeException extends BakeryException {
  constructor(size: number, minSize: number, maxSize: number) {
    super(`Invalid file size: ${size} bytes. Must be between ${minSize} and ${maxSize} bytes`, HttpStatus.BAD_REQUEST);
  }
}

/**
 * Exception thrown when magic number is invalid
 */
export class InvalidMagicNumberException extends BakeryException {
  constructor(expected: string, actual: string) {
    super(`Invalid magic number. Expected: ${expected}, Got: ${actual}`, HttpStatus.BAD_REQUEST);
  }
}

/**
 * Exception thrown when required fields are missing
 */
export class MissingRequiredFieldsException extends BakeryException {
  constructor(missingFields: string[]) {
    super(`Missing required fields: ${missingFields.join(', ')}`, HttpStatus.BAD_REQUEST);
  }
}

/**
 * Exception thrown when compression/decompression fails
 */
export class CompressionException extends BakeryException {
  constructor(message: string, cause?: Error) {
    super(`Compression error: ${message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    if (cause) {
      this.cause = cause;
    }
  }
}
