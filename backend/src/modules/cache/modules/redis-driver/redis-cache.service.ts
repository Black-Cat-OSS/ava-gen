import { Module, Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ICacheStrategy, CacheMemoryStats } from '../../interfaces';

/**
 * Redis Cache Service (заглушка)
 *
 * @class RedisCacheService
 */
@Injectable()
export class RedisCacheService implements ICacheStrategy, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisCacheService.name);

  async onModuleInit(): Promise<void> {
    this.logger.log('Redis cache service initialized (stub)');
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Redis cache service destroyed (stub)');
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
 * Redis Cache Module (заглушка)
 *
 * @module RedisCacheModule
 */
@Module({
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
