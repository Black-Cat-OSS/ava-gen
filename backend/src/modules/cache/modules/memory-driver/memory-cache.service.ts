import { Module, Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ICacheStrategy, CacheMemoryStats } from '../../interfaces';

/**
 * Memory Cache Service (заглушка)
 *
 * @class MemoryCacheService
 */
@Injectable()
export class MemoryCacheService implements ICacheStrategy, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MemoryCacheService.name);

  async onModuleInit(): Promise<void> {
    this.logger.log('Memory cache service initialized (stub)');
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Memory cache service destroyed (stub)');
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
 * Memory Cache Module (заглушка)
 *
 * @module MemoryCacheModule
 */
@Module({
  providers: [MemoryCacheService],
  exports: [MemoryCacheService],
})
export class MemoryCacheModule {}
