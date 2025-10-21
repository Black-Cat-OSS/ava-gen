import { Module, Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { YamlConfigService } from '../../../../config/modules/yaml-driver/yaml-config.service';
import { ICacheStrategy, CacheMemoryStats } from '../../interfaces';
import { CacheConnectionException, CacheOperationException } from '../../exceptions';

/**
 * Redis Cache Service
 *
 * Реализует ICacheStrategy для работы с Redis.
 * Поддерживает повторные попытки подключения и обработку ошибок.
 *
 * @class RedisCacheService
 * @implements {ICacheStrategy}
 */
@Injectable()
export class RedisCacheService implements ICacheStrategy, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisCacheService.name);
  private client: Redis;
  private isConnected = false;

  constructor(private readonly configService: YamlConfigService) {}

  /**
   * Инициализация модуля и подключение к Redis с повторными попытками
   *
   * @returns {Promise<void>}
   * @throws {CacheConnectionException} Если подключение не удалось установить после всех попыток
   */
  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing Redis cache connection...');
    await this.connectWithRetry();
  }

  /**
   * Отключение от Redis при уничтожении модуля
   *
   * @returns {Promise<void>}
   */
  async onModuleDestroy(): Promise<void> {
    this.logger.log('Destroying Redis cache connection...');
    if (this.client) {
      await this.client.quit();
    }
    this.isConnected = false;
    this.logger.log('Redis cache connection destroyed');
  }

  /**
   * Подключение к Redis с повторными попытками
   * Аналогично S3Service.connectWithRetry()
   *
   * @param {number} retryCount - текущий номер попытки
   * @returns {Promise<void>}
   * @throws {CacheConnectionException} Если все попытки подключения исчерпаны
   */
  private async connectWithRetry(retryCount = 1): Promise<void> {
    const config = this.configService.getCacheConfig();
    const { maxRetries, retryDelay } = config?.redis?.connection || {
      maxRetries: 3,
      retryDelay: 2000,
    };

    try {
      const redisConfig = config?.redis;
      if (!redisConfig) {
        throw new Error('Redis configuration not found');
      }

      this.client = new Redis({
        host: redisConfig.host,
        port: redisConfig.port,
        password: redisConfig.password || undefined,
        db: redisConfig.db || 0,
        retryStrategy: (times) => {
          if (times > maxRetries) {
            return null; // Stop retrying
          }
          return Math.min(times * retryDelay, 3000);
        },
        maxRetriesPerRequest: maxRetries,
        lazyConnect: true,
      });

      // Проверка подключения
      await this.client.connect();
      await this.client.ping();

      this.isConnected = true;
      this.logger.log(`Redis cache connected successfully on attempt ${retryCount}`);

      // Обработка событий переподключения
      this.client.on('error', (err) => {
        this.logger.error(`Redis connection error: ${err.message}`);
        this.isConnected = false;
      });

      this.client.on('reconnecting', () => {
        this.logger.warn('Redis reconnecting...');
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        this.logger.log('Redis reconnected successfully');
        this.isConnected = true;
      });

      this.client.on('ready', () => {
        this.logger.log('Redis is ready');
        this.isConnected = true;
      });
    } catch (error) {
      this.logger.error(`Redis connection attempt ${retryCount} failed`, error);

      if (retryCount < maxRetries) {
        this.logger.warn(
          `Retrying Redis connection in ${retryDelay}ms... (${retryCount}/${maxRetries})`,
        );
        await this.delay(retryDelay);
        return this.connectWithRetry(retryCount + 1);
      }

      this.logger.error(`Redis connection failed after ${maxRetries} attempts`);
      throw new CacheConnectionException(
        `Redis connection failed after ${maxRetries} attempts: ${error.message}`,
        'redis',
      );
    }
  }

  /**
   * Принудительное переподключение к Redis
   *
   * @returns {Promise<void>}
   * @throws {CacheConnectionException} Если переподключение не удалось после всех попыток
   */
  async reconnect(): Promise<void> {
    this.logger.log('Reconnecting to Redis cache...');
    if (this.client) {
      await this.client.quit();
    }
    this.isConnected = false;
    await this.connectWithRetry();
  }

  /**
   * Получение значения из Redis
   *
   * @param {string} key - Ключ для поиска
   * @returns {Promise<T | null>} Значение или null если не найдено
   * @throws {CacheOperationException} Если операция не удалась
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if (value === null) {
        return null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      throw new CacheOperationException(
        `Failed to get value from Redis: ${error.message}`,
        'get',
        key,
      );
    }
  }

  /**
   * Сохранение значения в Redis
   *
   * @param {string} key - Ключ для сохранения
   * @param {T} value - Значение для сохранения
   * @param {number} [ttl] - Время жизни в секундах (опционально)
   * @returns {Promise<void>}
   * @throws {CacheOperationException} Если операция не удалась
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.client.setex(key, ttl, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
    } catch (error) {
      throw new CacheOperationException(
        `Failed to set value in Redis: ${error.message}`,
        'set',
        key,
      );
    }
  }

  /**
   * Удаление значения из Redis
   *
   * @param {string} key - Ключ для удаления
   * @returns {Promise<void>}
   * @throws {CacheOperationException} Если операция не удалась
   */
  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      throw new CacheOperationException(
        `Failed to delete value from Redis: ${error.message}`,
        'del',
        key,
      );
    }
  }

  /**
   * Очистка Redis
   *
   * @param {string} [pattern] - Паттерн для удаления (опционально)
   * @returns {Promise<void>}
   * @throws {CacheOperationException} Если операция не удалась
   */
  async clear(pattern?: string): Promise<void> {
    try {
      if (pattern) {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
          await this.client.del(...keys);
        }
      } else {
        await this.client.flushdb();
      }
    } catch (error) {
      throw new CacheOperationException(
        `Failed to clear Redis: ${error.message}`,
        'clear',
        pattern,
      );
    }
  }

  /**
   * Проверка существования ключа в Redis
   *
   * @param {string} key - Ключ для проверки
   * @returns {Promise<boolean>} true если ключ существует
   * @throws {CacheOperationException} Если операция не удалась
   */
  async has(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      throw new CacheOperationException(
        `Failed to check key existence in Redis: ${error.message}`,
        'has',
        key,
      );
    }
  }

  /**
   * Получение нескольких значений за один запрос
   *
   * @param {string[]} keys - Массив ключей
   * @returns {Promise<(T | null)[]>} Массив значений
   * @throws {CacheOperationException} Если операция не удалась
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const values = await this.client.mget(...keys);
      return values.map((value) => (value ? JSON.parse(value) : null)) as (T | null)[];
    } catch (error) {
      throw new CacheOperationException(
        `Failed to get multiple values from Redis: ${error.message}`,
        'mget',
      );
    }
  }

  /**
   * Сохранение нескольких значений за один запрос
   *
   * @param {Array<{key: string; value: T; ttl?: number}>} entries - Массив записей
   * @returns {Promise<void>}
   * @throws {CacheOperationException} Если операция не удалась
   */
  async mset<T>(entries: Array<{key: string; value: T; ttl?: number}>): Promise<void> {
    try {
      const pipeline = this.client.pipeline();
      
      for (const entry of entries) {
        const serializedValue = JSON.stringify(entry.value);
        if (entry.ttl) {
          pipeline.setex(entry.key, entry.ttl, serializedValue);
        } else {
          pipeline.set(entry.key, serializedValue);
        }
      }
      
      await pipeline.exec();
    } catch (error) {
      throw new CacheOperationException(
        `Failed to set multiple values in Redis: ${error.message}`,
        'mset',
      );
    }
  }

  /**
   * Получение статистики использования памяти Redis
   *
   * @returns {Promise<CacheMemoryStats>} Статистика памяти
   * @throws {CacheOperationException} Если операция не удалась
   */
  async getMemoryUsage(): Promise<CacheMemoryStats> {
    try {
      const info = await this.client.memory('usage');
      const config = this.configService.getCacheConfig();
      const maxMemory = config?.redis?.max_memory;
      
      let limit = 0;
      if (maxMemory) {
        // Парсим строку типа "256mb" в байты
        const match = maxMemory.match(/^(\d+)(mb|gb|kb)?$/i);
        if (match) {
          const value = parseInt(match[1], 10);
          const unit = match[2]?.toLowerCase() || 'mb';
          switch (unit) {
            case 'kb':
              limit = value * 1024;
              break;
            case 'mb':
              limit = value * 1024 * 1024;
              break;
            case 'gb':
              limit = value * 1024 * 1024 * 1024;
              break;
            default:
              limit = value * 1024 * 1024; // Default to MB
          }
        }
      }

      const used = parseInt(info, 10) || 0;
      const percentage = limit > 0 ? (used / limit) * 100 : 0;

      return {
        used,
        limit,
        percentage,
        itemCount: await this.client.dbsize(),
      };
    } catch (error) {
      throw new CacheOperationException(
        `Failed to get memory usage from Redis: ${error.message}`,
        'getMemoryUsage',
      );
    }
  }

  /**
   * Задержка выполнения
   *
   * @param {number} ms - количество миллисекунд
   * @returns {Promise<void>}
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Redis Cache Module
 *
 * @module RedisCacheModule
 */
@Module({
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
