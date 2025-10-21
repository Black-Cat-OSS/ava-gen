import { Module, Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ICacheStrategy, CacheMemoryStats } from '../../interfaces';

/**
 * Memcached Cache Service (заглушка)
 *
 * @class MemcachedCacheService
 */
@Injectable()
export class MemcachedCacheService implements ICacheStrategy, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MemcachedCacheService.name);

  async onModuleInit(): Promise<void> {
    this.logger.log('Memcached cache service initialized (stub)');
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Memcached cache service destroyed (stub)');
  }

  async get<T>(): Promise<T | null> {
    return null;
  }

  async set(): Promise<void> {
    // Stub implementation
  }

  async del(): Promise<void> {
    // Stub implementation
  }

  async clear(): Promise<void> {
    // Stub implementation
  }

  async has(): Promise<boolean> {
    return false;
  }

  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    return keys.map(() => null);
  }

  async mset(): Promise<void> {
    // Stub implementation
  }

  async getMemoryUsage(): Promise<CacheMemoryStats> {
    return {
      used: 0,
      limit: 0,
      percentage: 0,
      itemCount: 0,
    };
  }
}

/**
 * Memcached Cache Module (заглушка)
 *
 * @module MemcachedCacheModule
 */
@Module({
  providers: [MemcachedCacheService],
  exports: [MemcachedCacheService],
})
export class MemcachedCacheModule {}
