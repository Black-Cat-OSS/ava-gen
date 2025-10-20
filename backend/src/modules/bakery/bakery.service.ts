import { Injectable, Logger } from '@nestjs/common';
import { IBakeryService, BakingResult } from './interfaces/bakery.interface';
import { AvatarObject } from './types/avatar-object.type';
import { FileFormat } from './types/file-format.type';
import { BakingOptions, UnbakingOptions } from './interfaces/formatter.interface';
import { JsonFormatterService } from './formatters/json-formatter.service';
import { BinaryFormatterService } from './formatters/binary-formatter.service';
import { CompressedFormatterService } from './formatters/compressed-formatter.service';
import { FileValidatorService } from './validators/file-validator.service';
import { StructureValidatorService } from './validators/structure-validator.service';
import { AVATAR_CONSTANTS } from './utils/constants';

/**
 * Bakery service - bakes avatar objects into files and unbakes them back
 * Uses metaphor: receives ingredients from ObjectBuilder and bakes bread (file)
 */
@Injectable()
export class BakeryService implements IBakeryService {
  private readonly logger = new Logger(BakeryService.name);

  constructor(
    private readonly jsonFormatter: JsonFormatterService,
    private readonly binaryFormatter: BinaryFormatterService,
    private readonly compressedFormatter: CompressedFormatterService,
    private readonly fileValidator: FileValidatorService,
    private readonly structureValidator: StructureValidatorService,
  ) {}

  /**
   * Bakes avatar object into a file
   * @param ingredients Object to bake (from ObjectBuilder)
   * @param options Baking options
   * @returns Baking result
   */
  async bakeObject(
    ingredients: AvatarObject,
    options: BakingOptions = {}
  ): Promise<BakingResult> {
    this.logger.log(`🏭 Received ingredients for baking: ${ingredients.metadata.id}`);

    const startTime = Date.now();

    try {
      // 🔍 Check ingredient quality
      this.logger.log('🔍 Checking ingredient quality...');
      await this.validateObject(ingredients);

      // 🍞 Choose baking recipe (formatter)
      this.logger.log('🍞 Choosing baking recipe...');
      const formatter = this.selectFormatter(options.format || AVATAR_CONSTANTS.DEFAULT_OPTIONS.FORMAT);

      // 🔥 Bake the bread
      this.logger.log('🔥 Starting baking process...');
      const bakedFile = await formatter.bake(ingredients, options);

      // ✅ Check bread quality
      this.logger.log('✅ Checking bread quality...');
      await this.validateFile(bakedFile);

      const bakingTime = Date.now() - startTime;

      const result: BakingResult = {
        file: bakedFile,
        size: bakedFile.length,
        format: options.format || AVATAR_CONSTANTS.DEFAULT_OPTIONS.FORMAT,
        objectId: ingredients.metadata.id,
        templateId: ingredients.template_id,
        bakedAt: new Date(),
        metrics: {
          bakingTime,
          compression: options.compression || AVATAR_CONSTANTS.DEFAULT_OPTIONS.COMPRESSION,
          optimization: options.optimization || AVATAR_CONSTANTS.DEFAULT_OPTIONS.OPTIMIZATION,
        },
      };

      this.logger.log(`🍞 Bread successfully baked! Size: ${result.size} bytes, Time: ${bakingTime}ms`);
      return result;

    } catch (error) {
      this.logger.error(`💥 Baking failed: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Unbakes file back into object
   * @param bread File to unbake
   * @param options Unbaking options
   * @returns Unbaked object
   */
  async unbakeFile(
    bread: Buffer,
    options: UnbakingOptions = {}
  ): Promise<AvatarObject> {
    this.logger.log('🔥 Starting to unbake bread...');

    try {
      // 🔍 Check bread quality
      this.logger.log('🔍 Checking bread quality...');
      await this.validateFile(bread);

      // 🍞 Determine bread recipe
      this.logger.log('🍞 Determining bread recipe...');
      const format = this.detectFormat(bread);

      // 🔥 Choose unbaking method
      this.logger.log('🔥 Choosing unbaking method...');
      const formatter = this.selectFormatter(format);

      // 🔄 Unbake into ingredients
      this.logger.log('🔄 Unbaking into ingredients...');
      const ingredients = await formatter.unbake(bread, options);

      // ✅ Check ingredient quality
      this.logger.log('✅ Checking restored ingredient quality...');
      await this.validateObject(ingredients);

      this.logger.log(`🛒 Ingredients successfully restored: ${ingredients.metadata.id}`);
      return ingredients;

    } catch (error) {
      this.logger.error(`💥 Unbaking failed: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Detects file format
   * @param file File to analyze
   * @returns Detected format
   */
  detectFormat(file: Buffer): FileFormat {
    if (file.length < 10) {
      throw new Error('File too small to determine format');
    }

    const beginning = file.subarray(0, 10).toString('utf8');
    
    if (beginning.includes('{')) {
      return 'json';
    }
    
    if (beginning.includes(AVATAR_CONSTANTS.MAGIC_NUMBERS.AVATAR_BINARY)) {
      return 'binary';
    }
    
    if (beginning.includes(AVATAR_CONSTANTS.MAGIC_NUMBERS.COMPRESSED)) {
      return 'compressed';
    }
    
    throw new Error('Unknown file format');
  }

  /**
   * Validates object structure
   * @param obj Object to validate
   * @returns Validation result
   */
  async validateObject(obj: AvatarObject): Promise<boolean> {
    return await this.structureValidator.validate(obj);
  }

  /**
   * Validates file
   * @param file File to validate
   * @returns Validation result
   */
  async validateFile(file: Buffer): Promise<boolean> {
    return await this.fileValidator.validate(file);
  }

  private selectFormatter(format: FileFormat) {
    switch (format) {
      case 'json':
        return this.jsonFormatter;
      case 'binary':
        return this.binaryFormatter;
      case 'compressed':
        return this.compressedFormatter;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }
}
