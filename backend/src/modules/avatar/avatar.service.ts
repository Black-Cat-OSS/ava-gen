import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageService } from '../storage/storage.service';
import { GeneratorService } from './modules/generator/generator.service';
import { FilterService } from './pipelines/filters/filter.service';
import { CacheService } from '../cache/cache.service';
import { EmojiService } from '../emoji';
import { GenerateAvatarDto, GetAvatarDto, ListAvatarsDto } from './dto/generate-avatar.dto';
import { GenerateAvatarV2Dto } from './dto/generate-avatar-v2.dto';
import { GenerateAvatarV3Dto } from './dto/generate-avatar-v3.dto';
import { ColorPaletteDto } from './dto/color-palette.dto';
import { Avatar } from './avatar.entity';
import { PalettesService } from '../palettes';
import { PerformanceMonitor } from './utils/performance-monitor.util';

@Injectable()
export class AvatarService {
  private readonly logger = new Logger(AvatarService.name);

  constructor(
    @InjectRepository(Avatar)
    private readonly avatarRepository: Repository<Avatar>,
    private readonly avatarGenerator: GeneratorService,
    private readonly storageService: StorageService,
    private readonly filterService: FilterService,
    private readonly cacheService: CacheService,
    private readonly emojiService: EmojiService,
    private readonly palettesService: PalettesService,
  ) {}

  async generateAvatar(dto: GenerateAvatarDto) {
    this.logger.log('Generating new avatar');

    const operationId = `avatar-${Date.now()}`;
    PerformanceMonitor.start(operationId);

    try {
      const avatarObject = await this.avatarGenerator.generateAvatar(
        dto.primaryColor,
        dto.foreignColor,
        dto.colorScheme,
        dto.seed,
        dto.type || 'pixelize',
      );

      const filePath = await this.storageService.saveAvatar(avatarObject);

      const avatar = this.avatarRepository.create({
        id: avatarObject.meta_data_name,
        name: avatarObject.meta_data_name,
        filePath,
        primaryColor: dto.primaryColor,
        foreignColor: dto.foreignColor,
        colorScheme: dto.colorScheme,
        seed: dto.seed,
        generatorType: dto.type || 'pixelize',
      });

      const savedAvatar = await this.avatarRepository.save(avatar);

      const metrics = PerformanceMonitor.stop(operationId);

      if (metrics) {
        this.logger.log(
          `Avatar generated successfully with ID: ${savedAvatar.id} | Total: ${PerformanceMonitor.formatMetrics(metrics)}`,
        );
      } else {
        this.logger.log(`Avatar generated successfully with ID: ${savedAvatar.id}`);
      }

      return {
        id: savedAvatar.id,
        createdAt: savedAvatar.createdAt,
        version: savedAvatar.version,
      };
    } catch (error) {
      PerformanceMonitor.stop(operationId);
      this.logger.error(`Failed to generate avatar: ${error.message}`, error);
      throw error;
    }
  }

  async generateAvatarV2(dto: GenerateAvatarV2Dto) {
    this.logger.log('Generating new gradient avatar (v2)');

    const operationId = `avatar-v2-${Date.now()}`;
    PerformanceMonitor.start(operationId);

    try {
      const avatarObject = await this.avatarGenerator.generateAvatar(
        dto.primaryColor,
        dto.foreignColor,
        dto.colorScheme,
        undefined,
        'gradient',
        dto.angle,
      );

      const filePath = await this.storageService.saveAvatar(avatarObject);

      const avatar = this.avatarRepository.create({
        id: avatarObject.meta_data_name,
        name: avatarObject.meta_data_name,
        filePath,
        primaryColor: dto.primaryColor,
        foreignColor: dto.foreignColor,
        colorScheme: dto.colorScheme,
        seed: undefined,
        generatorType: 'gradient',
      });

      const savedAvatar = await this.avatarRepository.save(avatar);

      const metrics = PerformanceMonitor.stop(operationId);

      if (metrics) {
        this.logger.log(
          `Gradient avatar generated successfully with ID: ${savedAvatar.id} | Total: ${PerformanceMonitor.formatMetrics(metrics)}`,
        );
      } else {
        this.logger.log(`Gradient avatar generated successfully with ID: ${savedAvatar.id}`);
      }

      return {
        id: savedAvatar.id,
        createdAt: savedAvatar.createdAt,
        version: savedAvatar.version,
      };
    } catch (error) {
      PerformanceMonitor.stop(operationId);
      this.logger.error(`Failed to generate gradient avatar: ${error.message}`, error);
      throw error;
    }
  }

  async generateAvatarV3(dto: GenerateAvatarV3Dto) {
    this.logger.log('Generating new emoji avatar (v3)');

    const operationId = `avatar-v3-${Date.now()}`;
    PerformanceMonitor.start(operationId);

    try {
      const avatarObject = await this.avatarGenerator.generateEmojiAvatar(
        dto.emoji,
        dto.backgroundType,
        dto.primaryColor,
        dto.foreignColor,
        undefined,
        dto.angle,
        dto.emojiSize,
      );

      const filePath = await this.storageService.saveAvatar(avatarObject);

      const avatar = this.avatarRepository.create({
        id: avatarObject.meta_data_name,
        name: avatarObject.meta_data_name,
        filePath,
        primaryColor: dto.primaryColor,
        foreignColor: dto.foreignColor,
        colorScheme: undefined,
        seed: undefined,
        generatorType: 'emoji',
      });

      const savedAvatar = await this.avatarRepository.save(avatar);

      const metrics = PerformanceMonitor.stop(operationId);

      if (metrics) {
        this.logger.log(
          `Emoji avatar generated successfully with ID: ${savedAvatar.id} | Total: ${PerformanceMonitor.formatMetrics(metrics)}`,
        );
      } else {
        this.logger.log(`Emoji avatar generated successfully with ID: ${savedAvatar.id}`);
      }

      return {
        id: savedAvatar.id,
        createdAt: savedAvatar.createdAt,
        version: savedAvatar.version,
      };
    } catch (error) {
      PerformanceMonitor.stop(operationId);
      this.logger.error(`Failed to generate emoji avatar: ${error.message}`, error);
      throw error;
    }
  }

  async getAvatar(id: string, dto: GetAvatarDto) {
    this.logger.log(`Retrieving avatar with ID: ${id}`);

    try {
      // Validate UUID format
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        throw new BadRequestException(`Invalid avatar ID format: ${id}. Expected UUID format.`);
      }

      // Validate size parameter
      if (dto.size && (dto.size < 4 || dto.size > 9)) {
        throw new BadRequestException('Size must be between 4 and 9 (2^n where 4 <= n <= 9)');
      }

      // Get avatar from database using TypeORM
      const avatar = await this.avatarRepository.findOne({
        where: { id },
      });

      if (!avatar) {
        throw new NotFoundException(`Avatar with ID ${id} not found`);
      }

      // Определяем размер изображения
      const size = dto.size || 6;

      let imageBuffer: Buffer;

      // Если есть фильтр, сначала проверяем кеш отфильтрованного изображения
      if (dto.filter) {
        const filteredCacheKey = `avatar:image:${id}:${size}:${dto.filter}`;

        // Если кеширование включено, проверяем кеш отфильтрованного изображения
        if (this.cacheService) {
          try {
            const cached = await this.cacheService.getBuffer(filteredCacheKey);
            if (cached) {
              this.logger.debug(
                `[CACHE] FILTERED HIT: ${id}:${size}:${dto.filter} loaded from cache (${cached.length} bytes)`,
              );
              this.logger.log(
                `Filtered image ${id}:${size}:${dto.filter} loaded from cache (${cached.length} bytes)`,
              );
              return {
                id: avatar.id,
                image: cached,
                contentType: 'image/png',
                createdAt: avatar.createdAt,
                version: avatar.version,
              };
            } else {
              this.logger.debug(
                `[CACHE] FILTERED MISS: ${id}:${size}:${dto.filter} not found in cache, will apply filter`,
              );
            }
          } catch (error) {
            this.logger.debug(
              `[CACHE] FILTERED ERROR: Failed to get ${id}:${size}:${dto.filter} from cache: ${error.message}`,
            );
            this.logger.warn(`Failed to get filtered image from cache: ${error.message}`);
          }
        }

        // Загружаем оригинальное изображение из хранилища
        this.logger.debug(`[STORAGE] Getting original image ${id}:${size} for filtering...`);
        imageBuffer = await this.storageService.loadImage(id, size);

        // Применяем фильтр
        this.logger.debug(
          `[FILTER] Applying ${dto.filter} to image ${id}:${size} (${imageBuffer.length} bytes)...`,
        );
        this.logger.log(
          `Applying filter: ${dto.filter}, original image size: ${imageBuffer.length} bytes`,
        );
        imageBuffer = await this.filterService.applyFilter(imageBuffer, dto.filter);
        this.logger.debug(
          `[FILTER] ${dto.filter} completed, new size: ${imageBuffer.length} bytes`,
        );
        this.logger.log(`Filter applied, new image size: ${imageBuffer.length} bytes`);

        // Логируем источник отфильтрованного изображения
        this.logger.log(
          `Filtered image ${id}:${size}:${dto.filter} generated from original (${imageBuffer.length} bytes)`,
        );

        // Если кеширование включено, кешируем отфильтрованное изображение
        if (this.cacheService) {
          try {
            this.logger.debug(
              `[CACHE] Saving filtered ${id}:${size}:${dto.filter} to cache (${imageBuffer.length} bytes)...`,
            );
            await this.cacheService.setBuffer(filteredCacheKey, imageBuffer, 'filtered');
            this.logger.debug(`[CACHE] Filtered ${id}:${size}:${dto.filter} successfully cached`);
          } catch (error) {
            this.logger.debug(
              `[CACHE] Failed to cache filtered ${id}:${size}:${dto.filter}: ${error.message}`,
            );
            this.logger.warn(`Failed to cache filtered image: ${error.message}`);
          }
        }
      } else {
        // Нет фильтра - загружаем оригинальное изображение из хранилища
        this.logger.log('No filter specified, returning original image');

        // Загружаем оригинальное изображение из хранилища
        this.logger.debug(`[STORAGE] Getting original image ${id}:${size}...`);
        imageBuffer = await this.storageService.loadImage(id, size);
        this.logger.log(
          `Original image ${id}:${size} loaded from storage (${imageBuffer.length} bytes)`,
        );

        // Если кеширование включено, кешируем оригинальное изображение
        if (this.cacheService) {
          try {
            const originalCacheKey = `avatar:image:${id}:${size}`;
            this.logger.debug(
              `[CACHE] Saving original ${id}:${size} to cache (${imageBuffer.length} bytes)...`,
            );
            await this.cacheService.setBuffer(originalCacheKey, imageBuffer, 'original');
            this.logger.debug(`[CACHE] Original ${id}:${size} successfully cached`);
          } catch (error) {
            this.logger.debug(`[CACHE] Failed to cache original ${id}:${size}: ${error.message}`);
            this.logger.warn(`Failed to cache original image: ${error.message}`);
          }
        }
      }

      this.logger.log(`Avatar retrieved successfully: ${id}`);

      return {
        id: avatar.id,
        image: imageBuffer,
        contentType: 'image/png',
        createdAt: avatar.createdAt,
        version: avatar.version,
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to get avatar: ${error.message}`, error);
      throw new Error(`Failed to get avatar: ${error.message}`);
    }
  }

  async deleteAvatar(id: string) {
    this.logger.log(`Deleting avatar with ID: ${id}`);

    try {
      // Validate UUID format
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        throw new BadRequestException(`Invalid avatar ID format: ${id}. Expected UUID format.`);
      }

      // Check if avatar exists in database using TypeORM
      const avatar = await this.avatarRepository.findOne({
        where: { id },
      });

      if (!avatar) {
        throw new NotFoundException(`Avatar with ID ${id} not found`);
      }

      // Delete from file system
      await this.storageService.deleteAvatar(id);

      // Delete from database using TypeORM
      await this.avatarRepository.remove(avatar);

      this.logger.log(`Avatar deleted successfully: ${id}`);

      return { message: 'Avatar deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete avatar: ${error.message}`, error);
      throw new Error(`Failed to delete avatar: ${error.message}`);
    }
  }

  async listAvatars(dto: ListAvatarsDto) {
    this.logger.log('Retrieving avatar list');

    try {
      const pick = dto.pick || 10;
      const offset = dto.offset || 0;

      // Use TypeORM query builder for pagination
      const [avatars, total] = await this.avatarRepository.findAndCount({
        take: pick,
        skip: offset,
        order: {
          createdAt: 'ASC',
        },
        select: [
          'id',
          'name',
          'createdAt',
          'version',
          'primaryColor',
          'foreignColor',
          'colorScheme',
          'seed',
        ],
      });

      this.logger.log(`Retrieved ${avatars.length} avatars from ${offset} offset`);

      return {
        items: avatars,
        pagination: {
          total,
          offset,
          pick,
          hasMore: offset + pick < total,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to list avatars: ${error.message}`, error);
      throw new Error(`Failed to list avatars: ${error.message}`);
    }
  }

  async getAvatarMetadata(id: string) {
    this.logger.log(`Retrieving avatar metadata for ID: ${id}`);

    try {
      // Validate UUID format
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        throw new BadRequestException(`Invalid avatar ID format: ${id}. Expected UUID format.`);
      }

      // Get avatar metadata from database using TypeORM
      const avatar = await this.avatarRepository.findOne({
        where: { id },
        select: [
          'id',
          'name',
          'createdAt',
          'version',
          'primaryColor',
          'foreignColor',
          'colorScheme',
          'seed',
          'generatorType',
        ],
      });

      if (!avatar) {
        throw new NotFoundException(`Avatar with ID ${id} not found`);
      }

      this.logger.log(`Avatar metadata retrieved successfully: ${id}`);

      return {
        id: avatar.id,
        name: avatar.name,
        createdAt: avatar.createdAt,
        version: avatar.version,
        primaryColor: avatar.primaryColor,
        foreignColor: avatar.foreignColor,
        colorScheme: avatar.colorScheme,
        seed: avatar.seed,
        generatorType: avatar.generatorType,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to get avatar metadata: ${error.message}`, error);
      throw new Error(`Failed to get avatar metadata: ${error.message}`);
    }
  }

  async healthCheck() {
    // Простая проверка подключения к репозиторию
    const dbHealth = await this.avatarRepository.count();

    // Проверка доступности Twemoji CDN через EmojiService
    const twemojiAvailable = await this.emojiService.checkTwemojiAvailability();

    if (!twemojiAvailable) {
      this.logger.warn('Twemoji CDN is not available - emoji avatar generation may fail');
    }

    const overallStatus = dbHealth && twemojiAvailable ? 'healthy' : 'unhealthy';

    return {
      database: dbHealth,
      status: overallStatus,
      services: {
        twemoji: {
          available: twemojiAvailable,
          lastChecked: new Date(),
        },
      },
    };
  }

  async getColorPalettes(): Promise<{ palettes: ColorPaletteDto[] }> {
    this.logger.log('Getting color palettes');

    // Получаем палитры от всех генераторов
    const pixelizePalettes = await this.avatarGenerator.getColorSchemes('pixelize');
    const wavePalettes = await this.avatarGenerator.getColorSchemes('wave');
    const gradientPalettes = await this.avatarGenerator.getColorSchemes('gradient');

    // Объединяем и дедуплицируем палитры
    const allPalettes = [...pixelizePalettes, ...wavePalettes, ...gradientPalettes];
    const uniquePalettes = allPalettes.filter(
      (palette, index, self) => index === self.findIndex(p => p.name === palette.name),
    );

    const palettes = uniquePalettes.map(palette => ({
      name: palette.name,
      primaryColor: palette.primaryColor,
      foreignColor: palette.foreignColor,
      key: palette.name.toLowerCase(),
    }));

    this.logger.log(`Returning ${palettes.length} color palettes`);

    return { palettes };
  }
}
