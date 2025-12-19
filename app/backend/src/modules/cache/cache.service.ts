import { Injectable, Logger, Optional } from '@nestjs/common';
import { YamlConfigService } from '../../config/modules/yaml-driver/yaml-config.service';
import { ICacheStrategy, CacheMemoryStats } from './interfaces';
import { RedisCacheService } from './modules/redis-driver';
import { MemcachedCacheService } from './modules/memcached-driver';
import { MemoryCacheService } from './modules/memory-driver';

/**
 * Сервис кеширования
 *
 * Использует паттерн Strategy для поддержки различных типов кеширования (Redis, Memcached, Memory).
 * Выбор стратегии происходит в конструкторе на основе конфигурации.
 *
 * CacheService является singleton и инициализируется один раз при старте приложения.
 *
 * @class CacheService
 */
@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly strategy: ICacheStrategy;

  constructor(
    private readonly configService: YamlConfigService,
    @Optional() private readonly redisCacheService: RedisCacheService,
    @Optional() private readonly memcachedCacheService: MemcachedCacheService,
    @Optional() private readonly memoryCacheService: MemoryCacheService,
  ) {
    const cacheConfig = this.configService.getCacheConfig();

    if (!cacheConfig) {
      // Если конфигурация кеширования отсутствует, используем no-op стратегию
      this.strategy = new NoOpCacheStrategy();
      this.logger.log('Cache configuration not found, using no-op strategy');
      return;
    }

    const cacheType = cacheConfig.type;

    if (cacheType === 'redis') {
      if (!redisCacheService) {
        throw new Error('RedisCacheService is not available but configured as cache type');
      }
      this.strategy = redisCacheService;
      this.logger.log('Using Redis cache strategy');
    } else if (cacheType === 'memcached') {
      if (!memcachedCacheService) {
        throw new Error('MemcachedCacheService is not available but configured as cache type');
      }
      this.strategy = memcachedCacheService;
      this.logger.log('Using Memcached cache strategy');
    } else if (cacheType === 'memory') {
      if (!memoryCacheService) {
        throw new Error('MemoryCacheService is not available but configured as cache type');
      }
      this.strategy = memoryCacheService;
      this.logger.log('Using Memory cache strategy');
    } else if (cacheType === 'disabled') {
      this.strategy = new NoOpCacheStrategy();
      this.logger.log('Using disabled cache strategy (no-op)');
    } else {
      throw new Error(`Unsupported cache type: ${cacheType}`);
    }

    this.logger.log(`CacheService initialized with ${this.getCacheType()} cache`);
  }

  /**
   * Получение значения из кеша
   *
   * @param {string} key - Ключ для поиска
   * @returns {Promise<T | null>} Значение или null если не найдено
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      return await this.strategy.get<T>(key);
    } catch (error) {
      this.logger.error(`Failed to get cache value for key ${key}: ${error.message}`);
      return null; // Graceful degradation
    }
  }

  /**
   * Сохранение значения в кеш
   *
   * @param {string} key - Ключ для сохранения
   * @param {T} value - Значение для сохранения
   * @param {string} [ttlType] - Тип TTL из конфигурации (avatars, metadata, lists, default)
   * @returns {Promise<void>}
   */
  async set<T>(key: string, value: T, ttlType?: string): Promise<void> {
    try {
      const ttl = this.getTTL(ttlType);
      await this.strategy.set(key, value, ttl);
    } catch (error) {
      this.logger.error(`Failed to set cache value for key ${key}: ${error.message}`);
      // Не выбрасываем ошибку - graceful degradation
    }
  }

  /**
   * Удаление значения из кеша
   *
   * @param {string} key - Ключ для удаления
   * @returns {Promise<void>}
   */
  async del(key: string): Promise<void> {
    try {
      await this.strategy.del(key);
    } catch (error) {
      this.logger.error(`Failed to delete cache value for key ${key}: ${error.message}`);
      // Не выбрасываем ошибку - graceful degradation
    }
  }

  /**
   * Очистка кеша
   *
   * @param {string} [pattern] - Паттерн для удаления (опционально)
   * @returns {Promise<void>}
   */
  async clear(pattern?: string): Promise<void> {
    try {
      await this.strategy.clear(pattern);
    } catch (error) {
      this.logger.error(
        `Failed to clear cache${pattern ? ` with pattern ${pattern}` : ''}: ${error.message}`,
      );
      // Не выбрасываем ошибку - graceful degradation
    }
  }

  /**
   * Проверка существования ключа в кеше
   *
   * @param {string} key - Ключ для проверки
   * @returns {Promise<boolean>} true если ключ существует
   */
  async has(key: string): Promise<boolean> {
    try {
      return await this.strategy.has(key);
    } catch (error) {
      this.logger.error(`Failed to check cache key existence ${key}: ${error.message}`);
      return false; // Graceful degradation
    }
  }

  /**
   * Получение нескольких значений за один запрос
   *
   * @param {string[]} keys - Массив ключей
   * @returns {Promise<(T | null)[]>} Массив значений
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      return await this.strategy.mget<T>(keys);
    } catch (error) {
      this.logger.error(`Failed to get multiple cache values: ${error.message}`);
      return keys.map(() => null); // Graceful degradation
    }
  }

  /**
   * Сохранение нескольких значений за один запрос
   *
   * @param {Array<{key: string; value: T; ttlType?: string}>} entries - Массив записей
   * @returns {Promise<void>}
   */
  async mset<T>(entries: Array<{ key: string; value: T; ttlType?: string }>): Promise<void> {
    try {
      const cacheEntries = entries.map(entry => ({
        key: entry.key,
        value: entry.value,
        ttl: this.getTTL(entry.ttlType),
      }));
      await this.strategy.mset(cacheEntries);
    } catch (error) {
      this.logger.error(`Failed to set multiple cache values: ${error.message}`);
      // Не выбрасываем ошибку - graceful degradation
    }
  }

  /**
   * Получение статистики использования памяти
   *
   * @returns {Promise<CacheMemoryStats>} Статистика памяти
   */
  async getMemoryUsage(): Promise<CacheMemoryStats> {
    try {
      return await this.strategy.getMemoryUsage();
    } catch (error) {
      this.logger.error(`Failed to get cache memory usage: ${error.message}`);
      return {
        used: 0,
        limit: 0,
        percentage: 0,
        itemCount: 0,
      };
    }
  }

  /**
   * Проверка использования памяти и вывод предупреждений
   *
   * @returns {Promise<void>}
   */
  async checkMemoryUsage(): Promise<void> {
    try {
      const stats = await this.strategy.getMemoryUsage();
      const cacheConfig = this.configService.getCacheConfig();
      const warnLevel = cacheConfig?.warn_memory_level || 80;

      if (stats.percentage >= warnLevel) {
        this.logger.warn(
          `Cache memory usage is high: ${stats.percentage.toFixed(2)}% ` +
            `(${(stats.used / 1024 / 1024).toFixed(2)}MB / ${(stats.limit / 1024 / 1024).toFixed(2)}MB)`,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to check cache memory usage: ${error.message}`);
    }
  }

  /**
   * Получение уровня предупреждения о памяти
   *
   * @returns {number} Уровень предупреждения (0-100)
   */
  getWarnMemoryLevel(): number {
    const cacheConfig = this.configService.getCacheConfig();
    return cacheConfig?.warn_memory_level || 80;
  }

  /**
   * Получение типа кеширования
   *
   * @returns {string} Тип кеширования
   */
  getCacheType(): string {
    const cacheConfig = this.configService.getCacheConfig();
    return cacheConfig?.type || 'disabled';
  }

  /**
   * Получение TTL из конфигурации
   *
   * @private
   * @param {string} [ttlType] - Тип TTL
   * @returns {number | undefined} TTL в секундах
   */
  private getTTL(ttlType?: string): number | undefined {
    const cacheConfig = this.configService.getCacheConfig();
    if (!cacheConfig?.ttl) {
      return undefined;
    }

    if (ttlType && cacheConfig.ttl[ttlType as keyof typeof cacheConfig.ttl]) {
      return cacheConfig.ttl[ttlType as keyof typeof cacheConfig.ttl];
    }

    return cacheConfig.ttl.default;
  }

  /**
   * Получение Buffer из кеша
   *
   * @param {string} key - Ключ для поиска
   * @returns {Promise<Buffer | null>} Buffer или null если не найдено
   */
  async getBuffer(key: string): Promise<Buffer | null> {
    try {
      return await this.strategy.getBuffer(key);
    } catch (error) {
      this.logger.error(`Failed to get buffer from cache for key ${key}: ${error.message}`);
      return null; // Graceful degradation
    }
  }

  /**
   * Сохранение Buffer в кеш
   *
   * @param {string} key - Ключ для сохранения
   * @param {Buffer} value - Buffer для сохранения
   * @param {string} [ttlType] - Тип TTL (опционально)
   * @returns {Promise<void>}
   */
  async setBuffer(key: string, value: Buffer, ttlType?: string): Promise<void> {
    try {
      const ttl = this.getTTL(ttlType);
      await this.strategy.setBuffer(key, value, ttl);
    } catch (error) {
      this.logger.error(`Failed to set buffer in cache for key ${key}: ${error.message}`);
      // Не выбрасываем ошибку - graceful degradation
    }
  }
}

/**
 * No-op стратегия кеширования (заглушка)
 *
 * Используется когда кеширование отключено или недоступно.
 * Все операции выполняются без реального кеширования.
 *
 * @class NoOpCacheStrategy
 */
class NoOpCacheStrategy implements ICacheStrategy {
  async get<T>(): Promise<T | null> {
    return null;
  }

  async set(): Promise<void> {
    // No-op
  }

  async del(): Promise<void> {
    // No-op
  }

  async clear(): Promise<void> {
    // No-op
  }

  async has(): Promise<boolean> {
    return false;
  }

  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    return keys.map(() => null);
  }

  async mset(): Promise<void> {
    // No-op
  }

  async getMemoryUsage(): Promise<CacheMemoryStats> {
    return {
      used: 0,
      limit: 0,
      percentage: 0,
      itemCount: 0,
    };
  }

  async getBuffer(): Promise<Buffer | null> {
    return null;
  }

  async setBuffer(): Promise<void> {
    // No-op
  }
}
