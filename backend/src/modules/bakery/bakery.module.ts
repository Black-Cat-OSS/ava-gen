import { Module } from '@nestjs/common';
import { BakeryService } from './bakery.service';
import { JsonFormatterService } from './formatters/json-formatter.service';
import { BinaryFormatterService } from './formatters/binary-formatter.service';
import { CompressedFormatterService } from './formatters/compressed-formatter.service';
import { FileValidatorService } from './validators/file-validator.service';
import { StructureValidatorService } from './validators/structure-validator.service';

/**
 * Bakery module - independent module for baking and unbaking avatar objects
 * Self-contained with no external dependencies
 */
@Module({
  providers: [
    BakeryService,
    JsonFormatterService,
    BinaryFormatterService,
    CompressedFormatterService,
    FileValidatorService,
    StructureValidatorService,
  ],
  exports: [
    BakeryService,
  ],
})
export class BakeryModule {}
