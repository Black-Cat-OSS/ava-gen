import { Module, Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as Memcached from 'memcached';
import { YamlConfigService } from '../../../../config/modules/yaml-driver/yaml-config.service';
import { ICacheStrategy, CacheMemoryStats } from '../../interfaces';
import { CacheConnectionException, CacheOperationException } from '../../exceptions';

/**
 * Memcached Cache Service
 *
 * Реализует ICacheStrategy для работы с Memcached.
 * Поддерживает multiple servers и connection pooling.
 *
 * @class MemcachedCacheService
 * @implements {ICacheStrategy}
 */
@Injectable()
export class MemcachedCacheService implements ICacheStrategy, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MemcachedCacheService.name);
  private client: Memcached;
  private isConnected = false;

  constructor(private readonly configService: YamlConfigService) {}

  /**
   * Инициализация модуля и подключение к Memcached
   *
   * @returns {Promise<void>}
   * @throws {CacheConnectionException} Если подключение не удалось установить
   */
  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing Memcached cache connection...');
    await this.connect();
  }

  /**
   * Отключение от Memcached при уничтожении модуля
   *
   * @returns {Promise<void>}
   */
  async onModuleDestroy(): Promise<void> {
    this.logger.log('Destroying Memcached cache connection...');
    if (this.client) {
      this.client.end();
    }
    this.isConnected = false;
    this.logger.log('Memcached cache connection destroyed');
  }

  /**
   * Подключение к Memcached
   *
   * @returns {Promise<void>}
   * @throws {CacheConnectionException} Если подключение не удалось
   */
  private async connect(): Promise<void> {
    try {
      const config = this.configService.getCacheConfig();
      const memcachedConfig = config?.memcached;
      
      if (!memcachedConfig) {
        throw new Error('Memcached configuration not found');
      }

      this.client = new Memcached(memcachedConfig.hosts, {
        retries: 3,
        retry: 2000,
        remove: true,
        failOverServers: memcachedConfig.hosts.slice(1),
        timeout: 5000,
        idle: 30000,
        namespace: 'avatar-gen:',
      });

      // Проверка подключения
      await this.ping();

      this.isConnected = true;
      this.logger.log(`Memcached cache connected successfully to ${memcachedConfig.hosts.join(', ')}`);

      // Обработка событий
      this.client.on('failure', (details) => {
        this.logger.error(`Memcached server failure: ${details.server}`);
        this.isConnected = false;
      });

      this.client.on('reconnecting', (details) => {
        this.logger.warn(`Memcached reconnecting to: ${details.server}`);
        this.isConnected = false;
      });

      this.client.on('reconnected', (details) => {
        this.logger.log(`Memcached reconnected to: ${details.server}`);
        this.isConnected = true;
      });

      this.client.on('issue', (details) => {
        this.logger.warn(`Memcached issue: ${details.type} - ${details.message}`);
      });
    } catch (error) {
      this.logger.error(`Memcached connection failed: ${error.message}`);
      throw new CacheConnectionException(
        `Memcached connection failed: ${error.message}`,
        'memcached',
      );
    }
  }

  /**
   * Проверка доступности Memcached
   *
   * @returns {Promise<void>}
   * @throws {Error} Если Memcached недоступен
   */
  private async ping(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.version((err) => {
        if (err) {
          reject(new Error(`Memcached ping failed: ${err.message}`));
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Получение значения из Memcached
   *
   * @param {string} key - Ключ для поиска
   * @returns {Promise<T | null>} Значение или null если не найдено
   * @throws {CacheOperationException} Если операция не удалась
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      return new Promise((resolve, reject) => {
        this.client.get(key, (err, data) => {
          if (err) {
            reject(new CacheOperationException(
              `Failed to get value from Memcached: ${err.message}`,
              'get',
              key,
            ));
          } else if (data === undefined) {
            resolve(null);
          } else {
            try {
              resolve(JSON.parse(data) as T);
            } catch (parseError) {
              reject(new CacheOperationException(
                `Failed to parse value from Memcached: ${parseError.message}`,
                'get',
                key,
              ));
            }
          }
        });
      });
    } catch (error) {
      if (error instanceof CacheOperationException) {
        throw error;
      }
      throw new CacheOperationException(
        `Failed to get value from Memcached: ${error.message}`,
        'get',
        key,
      );
    }
  }

  /**
   * Сохранение значения в Memcached
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
      const lifetime = ttl || 0; // 0 = no expiration
      
      return new Promise((resolve, reject) => {
        this.client.set(key, serializedValue, lifetime, (err) => {
          if (err) {
            reject(new CacheOperationException(
              `Failed to set value in Memcached: ${err.message}`,
              'set',
              key,
            ));
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      if (error instanceof CacheOperationException) {
        throw error;
      }
      throw new CacheOperationException(
        `Failed to set value in Memcached: ${error.message}`,
        'set',
        key,
      );
    }
  }

  /**
   * Удаление значения из Memcached
   *
   * @param {string} key - Ключ для удаления
   * @returns {Promise<void>}
   * @throws {CacheOperationException} Если операция не удалась
   */
  async del(key: string): Promise<void> {
    try {
      return new Promise((resolve, reject) => {
        this.client.del(key, (err) => {
          if (err) {
            reject(new CacheOperationException(
              `Failed to delete value from Memcached: ${err.message}`,
              'del',
              key,
            ));
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      if (error instanceof CacheOperationException) {
        throw error;
      }
      throw new CacheOperationException(
        `Failed to delete value from Memcached: ${error.message}`,
        'del',
        key,
      );
    }
  }

  /**
   * Очистка Memcached
   *
   * @param {string} [pattern] - Паттерн для удаления (опционально)
   * @returns {Promise<void>}
   * @throws {CacheOperationException} Если операция не удалась
   */
  async clear(pattern?: string): Promise<void> {
    try {
      if (pattern) {
        // Memcached не поддерживает pattern-based deletion
        // Используем flush_all для полной очистки
        this.logger.warn(`Memcached does not support pattern-based deletion. Clearing all cache.`);
        await this.flushAll();
      } else {
        await this.flushAll();
      }
    } catch (error) {
      throw new CacheOperationException(
        `Failed to clear Memcached: ${error.message}`,
        'clear',
        pattern,
      );
    }
  }

  /**
   * Полная очистка Memcached
   *
   * @private
   * @returns {Promise<void>}
   */
  private async flushAll(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.flush((err) => {
        if (err) {
          reject(new Error(`Failed to flush Memcached: ${err.message}`));
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Проверка существования ключа в Memcached
   *
   * @param {string} key - Ключ для проверки
   * @returns {Promise<boolean>} true если ключ существует
   * @throws {CacheOperationException} Если операция не удалась
   */
  async has(key: string): Promise<boolean> {
    try {
      const value = await this.get(key);
      return value !== null;
    } catch (error) {
      if (error instanceof CacheOperationException) {
        throw error;
      }
      throw new CacheOperationException(
        `Failed to check key existence in Memcached: ${error.message}`,
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
      return new Promise((resolve, reject) => {
        this.client.getMulti(keys, (err, data) => {
          if (err) {
            reject(new CacheOperationException(
              `Failed to get multiple values from Memcached: ${err.message}`,
              'mget',
            ));
          } else {
            const results = keys.map((key) => {
              const value = data[key];
              if (value === undefined) {
                return null;
              }
              try {
                return JSON.parse(value) as T;
              } catch (parseError) {
                this.logger.warn(`Failed to parse value for key ${key}: ${parseError.message}`);
                return null;
              }
            });
            resolve(results);
          }
        });
      });
    } catch (error) {
      if (error instanceof CacheOperationException) {
        throw error;
      }
      throw new CacheOperationException(
        `Failed to get multiple values from Memcached: ${error.message}`,
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
      const promises = entries.map((entry) => 
        this.set(entry.key, entry.value, entry.ttl)
      );
      await Promise.all(promises);
    } catch (error) {
      if (error instanceof CacheOperationException) {
        throw error;
      }
      throw new CacheOperationException(
        `Failed to set multiple values in Memcached: ${error.message}`,
        'mset',
      );
    }
  }

  /**
   * Получение статистики использования памяти Memcached
   *
   * @returns {Promise<CacheMemoryStats>} Статистика памяти
   * @throws {CacheOperationException} Если операция не удалась
   */
  async getMemoryUsage(): Promise<CacheMemoryStats> {
    try {
      return new Promise((resolve, reject) => {
        this.client.stats((err, stats) => {
          if (err) {
            reject(new CacheOperationException(
              `Failed to get memory usage from Memcached: ${err.message}`,
              'getMemoryUsage',
            ));
          } else {
            // Получаем статистику с первого сервера
            const firstServer = Object.keys(stats)[0];
            const serverStats = stats[firstServer];
            
            const used = parseInt(serverStats.bytes || '0', 10);
            const limit = parseInt(serverStats.limit_maxbytes || '0', 10);
            const percentage = limit > 0 ? (used / limit) * 100 : 0;
            const itemCount = parseInt(serverStats.curr_items || '0', 10);

            resolve({
              used,
              limit,
              percentage,
              itemCount,
            });
          }
        });
      });
    } catch (error) {
      if (error instanceof CacheOperationException) {
        throw error;
      }
      throw new CacheOperationException(
        `Failed to get memory usage from Memcached: ${error.message}`,
        'getMemoryUsage',
      );
    }
  }
}

/**
 * Memcached Cache Module
 *
 * @module MemcachedCacheModule
 */
@Module({
  providers: [MemcachedCacheService],
  exports: [MemcachedCacheService],
})
export class MemcachedCacheModule {}
