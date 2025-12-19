import { Injectable, Logger, Optional } from '@nestjs/common';
import { AvatarObject } from '../../common/interfaces/avatar-object.interface';
import { IStorageStrategy } from '../../common/interfaces/storage-strategy.interface';
import { YamlConfigService } from '../../config/modules/yaml-driver/yaml-config.service';
import { CacheService } from '../cache/cache.service';
import { LocalStorageService } from './modules/local-driver';
import { S3StorageService } from './modules/s3-driver';

/**
 * Сервис хранилища аватаров
 *
 * Использует паттерн Strategy для поддержки различных типов хранилищ (local, s3).
 * Выбор стратегии происходит в конструкторе на основе конфигурации.
 *
 * StorageService является singleton и инициализируется один раз при старте приложения.
 *
 * @class StorageService
 */
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly strategy: IStorageStrategy;

  constructor(
    private readonly configService: YamlConfigService,
    @Optional() private readonly localStorageService: LocalStorageService,
    @Optional() private readonly s3StorageService: S3StorageService,
    @Optional() private readonly cacheService: CacheService,
  ) {
    const storageConfig = this.configService.getStorageConfig();
    const storageType = storageConfig.type;

    //FIXME: What a hall here?
    if (storageType === 's3') {
      if (!s3StorageService) {
        throw new Error('S3StorageService is not available but configured as storage type');
      }
      this.strategy = s3StorageService;
      this.logger.log('Using S3 storage strategy');
    } else {
      if (!localStorageService) {
        throw new Error('LocalStorageService is not available but configured as storage type');
      }
      this.strategy = localStorageService;
      this.logger.log('Using local storage strategy');
    }

    this.logger.log(`StorageService initialized with ${this.getStorageType()} storage`);
  }

  /**
   * Сохранение аватара
   *
   * @param {AvatarObject} avatarObject - Объект аватара для сохранения
   * @returns {Promise<string>} Путь или URL сохраненного аватара
   * @throws {Error} Если сохранение не удалось
   */
  async saveAvatar(avatarObject: AvatarObject): Promise<string> {
    const result = await this.strategy.saveAvatar(avatarObject);

    // Кешируем отдельные изображения по размерам
    if (this.cacheService) {
      try {
        this.logger.debug(`[CACHE] Caching all image sizes for ${avatarObject.meta_data_name}...`);
        const imageKeys = [
          'image_4n',
          'image_5n',
          'image_6n',
          'image_7n',
          'image_8n',
          'image_9n',
        ] as const;

        for (const key of imageKeys) {
          const imageBuffer = avatarObject[key];
          if (imageBuffer && Buffer.isBuffer(imageBuffer)) {
            const size = key.replace('image_', '').replace('n', '');
            const cacheKey = `avatar:image:${avatarObject.meta_data_name}:${size}`;
            this.logger.debug(
              `[CACHE] Caching size ${size}: ${cacheKey} (${imageBuffer.length} bytes)`,
            );
            await this.cacheService.setBuffer(cacheKey, imageBuffer, 'images');
          }
        }

        this.logger.debug(`[CACHE] All image sizes cached for ${avatarObject.meta_data_name}`);
      } catch (error) {
        this.logger.debug(
          `[CACHE] Failed to cache images for ${avatarObject.meta_data_name}: ${error.message}`,
        );
        this.logger.warn(`Failed to cache avatar images after save: ${error.message}`);
        // Не выбрасываем ошибку - сохранение прошло успешно
      }
    } else {
      this.logger.debug(
        `[CACHE] Cache service not available, skipping cache for ${avatarObject.meta_data_name}`,
      );
    }

    return result;
  }

  /**
   * Загрузка аватара
   *
   * @param {string} id - Идентификатор аватара
   * @returns {Promise<AvatarObject>} Объект аватара
   * @throws {Error} Если аватар не найден или загрузка не удалась
   */
  async loadAvatar(id: string): Promise<AvatarObject> {
    // Загрузка из storage (без кеширования объекта)
    this.logger.debug(`Loading avatar from storage: ${id}`);
    const avatar = await this.strategy.loadAvatar(id);

    // Кешируем отдельные изображения по размерам
    if (this.cacheService) {
      try {
        this.logger.debug(`[CACHE] Caching all image sizes for ${id}...`);
        const imageKeys = [
          'image_4n',
          'image_5n',
          'image_6n',
          'image_7n',
          'image_8n',
          'image_9n',
        ] as const;

        for (const key of imageKeys) {
          const imageBuffer = avatar[key];
          if (imageBuffer && Buffer.isBuffer(imageBuffer)) {
            const size = key.replace('image_', '').replace('n', '');
            const cacheKey = `avatar:image:${id}:${size}`;
            this.logger.debug(
              `[CACHE] Caching size ${size}: ${cacheKey} (${imageBuffer.length} bytes)`,
            );
            await this.cacheService.setBuffer(cacheKey, imageBuffer, 'images');
          }
        }

        this.logger.debug(`[CACHE] All image sizes cached for ${id}`);
      } catch (error) {
        this.logger.debug(`[CACHE] Failed to cache images for ${id}: ${error.message}`);
        this.logger.warn(`Failed to cache avatar images after load: ${error.message}`);
        // Не выбрасываем ошибку - загрузка прошла успешно
      }
    } else {
      this.logger.debug(`[CACHE] Cache service not available, skipping cache for ${id}`);
    }

    return avatar;
  }

  /**
   * Загрузка изображения определенного размера
   *
   * @param {string} id - Идентификатор аватара
   * @param {number} size - Размер изображения (4-9)
   * @returns {Promise<Buffer>} Buffer изображения
   * @throws {Error} Если изображение не найдено или загрузка не удалась
   */
  async loadImage(id: string, size: number): Promise<Buffer> {
    // Проверяем валидность размера
    if (size < 4 || size > 9) {
      throw new Error(`Invalid image size: ${size}. Must be between 4 and 9`);
    }

    const cacheKey = `avatar:image:${id}:${size}`;

    // Попытка загрузить из кеша
    if (this.cacheService) {
      try {
        const cached = await this.cacheService.getBuffer(cacheKey);
        if (cached) {
          this.logger.debug(
            `[CACHE] HIT: Image ${id}:${size} loaded from cache (${cached.length} bytes)`,
          );
          this.logger.log(`Image ${id}:${size} loaded from cache (${cached.length} bytes)`);
          return cached;
        } else {
          this.logger.debug(
            `[CACHE] MISS: Image ${id}:${size} not found in cache, loading from storage`,
          );
        }
      } catch (error) {
        this.logger.debug(
          `[CACHE] ERROR: Failed to get image ${id}:${size} from cache: ${error.message}`,
        );
        this.logger.warn(`Failed to get image from cache: ${error.message}`);
        // Продолжаем загрузку из storage
      }
    } else {
      this.logger.debug(`[CACHE] Cache service not available, loading ${id}:${size} from storage`);
    }

    // Загрузка из storage
    this.logger.debug(`[STORAGE] Loading image ${id}:${size} from storage...`);
    const avatar = await this.strategy.loadAvatar(id);
    const imageKey = `image_${size}n` as keyof AvatarObject;
    const imageBuffer = avatar[imageKey] as Buffer;

    if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
      throw new Error(`Image ${size} not found for avatar ${id}`);
    }

    // Логируем источник загрузки
    const storageType = this.getStorageType();
    this.logger.log(`Image ${id}:${size} loaded from ${storageType} (${imageBuffer.length} bytes)`);

    // Сохранение в кеш
    if (this.cacheService) {
      try {
        this.logger.debug(
          `[CACHE] Saving image ${id}:${size} to cache (${imageBuffer.length} bytes)...`,
        );
        await this.cacheService.setBuffer(cacheKey, imageBuffer, 'images');
        this.logger.debug(`[CACHE] Image ${id}:${size} successfully cached`);
      } catch (error) {
        this.logger.debug(`[CACHE] Failed to cache image ${id}:${size}: ${error.message}`);
        this.logger.warn(`Failed to cache image after load: ${error.message}`);
        // Не выбрасываем ошибку - загрузка прошла успешно
      }
    }

    return imageBuffer;
  }

  /**
   * Удаление аватара
   *
   * @param {string} id - Идентификатор аватара
   * @returns {Promise<void>}
   * @throws {Error} Если удаление не удалось
   */
  async deleteAvatar(id: string): Promise<void> {
    await this.strategy.deleteAvatar(id);

    // Инвалидация кеша изображений
    if (this.cacheService) {
      try {
        // Очищаем все изображения для данного аватара
        const imageSizes = [4, 5, 6, 7, 8, 9];
        for (const size of imageSizes) {
          await this.cacheService.del(`avatar:image:${id}:${size}`);
        }

        // Очищаем отфильтрованные изображения
        const filters = ['grayscale', 'sepia', 'negative'];
        for (const size of imageSizes) {
          for (const filter of filters) {
            await this.cacheService.del(`avatar:image:${id}:${size}:${filter}`);
          }
        }

        await this.cacheService.del(`avatar:exists:${id}`);
        this.logger.debug(`Cache invalidated for deleted avatar: ${id}`);
      } catch (error) {
        this.logger.warn(`Failed to invalidate cache for deleted avatar: ${error.message}`);
        // Не выбрасываем ошибку - удаление прошло успешно
      }
    }
  }

  /**
   * Проверка существования аватара
   *
   * @param {string} id - Идентификатор аватара
   * @returns {Promise<boolean>} true если аватар существует
   */
  async exists(id: string): Promise<boolean> {
    // Попытка проверить в кеше
    if (this.cacheService) {
      const cacheKey = `avatar:exists:${id}`;
      try {
        const cached = await this.cacheService.get<boolean>(cacheKey);
        if (cached !== null) {
          this.logger.debug(`Avatar existence checked from cache: ${id}`);
          return cached;
        }
      } catch (error) {
        this.logger.warn(`Failed to check avatar existence from cache: ${error.message}`);
        // Продолжаем проверку в storage
      }
    }

    // Проверка в storage
    const exists = await this.strategy.exists(id);

    // Сохранение результата в кеш
    if (this.cacheService) {
      const cacheKey = `avatar:exists:${id}`;
      try {
        await this.cacheService.set(cacheKey, exists, 'exists');
        this.logger.debug(`Avatar existence cached: ${id} = ${exists}`);
      } catch (error) {
        this.logger.warn(`Failed to cache avatar existence: ${error.message}`);
        // Не выбрасываем ошибку - проверка прошла успешно
      }
    }

    return exists;
  }

  /**
   * Получение типа используемого хранилища
   *
   * @returns {string} Тип хранилища ('local' или 's3')
   */
  getStorageType(): string {
    return this.configService.getStorageConfig().type;
  }
}
