import { Module, DynamicModule, Global } from '@nestjs/common';
import { ConfigModule } from '../../config/config.module';
import { CacheService } from './cache.service';
import { RedisCacheModule } from './modules/redis-driver';
import { MemcachedCacheModule } from './modules/memcached-driver';
import { MemoryCacheModule } from './modules/memory-driver';

/**
 * Главный модуль кеширования
 *
 * Динамически подключает нужный модуль кеширования (Redis, Memcached, Memory) на основе конфигурации.
 * Использует паттерн Strategy для поддержки различных типов кеширования.
 *
 * Следует best practices NestJS для динамических модулей:
 * @see https://docs.nestjs.com/fundamentals/dynamic-modules
 *
 * @module CacheModule
 */
@Global()
@Module({})
export class CacheModule {
  /**
   * Регистрация модуля с автоматическим определением типа кеширования
   *
   * **Упрощенная архитектура (без токенов и фабрик):**
   * 1. Импортирует все модули кеширования (Redis, Memcached, Memory)
   * 2. Каждый модуль проверяет конфигурацию в `onModuleInit()` и пропускает инициализацию если не нужен
   * 3. `CacheService` напрямую инжектирует все сервисы в конструктор
   * 4. В конструкторе `CacheService` выбирается нужная стратегия на основе конфигурации
   *
   * **Простота и надежность:**
   * - Нет промежуточных токенов (`CACHE_STRATEGY`)
   * - Нет фабрик (`useFactory`)
   * - Стандартный NestJS DI через импорты модулей
   * - Выбор стратегии в конструкторе `CacheService`
   *
   * **Singleton lifecycle:**
   * - `CacheService` создается один раз при старте приложения
   * - Живет на протяжении всей жизни приложения
   * - Повторное создание не происходит
   *
   * **Условная инициализация:**
   * - `RedisCacheModule.onModuleInit()` → выполняется только если `cache.type === 'redis'`
   * - `MemcachedCacheModule.onModuleInit()` → выполняется только если `cache.type === 'memcached'`
   * - `MemoryCacheModule.onModuleInit()` → выполняется только если `cache.type === 'memory'`
   *
   * @static
   * @returns {DynamicModule} Динамический модуль
   *
   * @example
   * ```typescript
   * @Module({
   *   imports: [CacheModule.register()],
   * })
   * export class AvatarModule {}
   * ```
   */
  static register(): DynamicModule {
    return {
      module: CacheModule,
      imports: [ConfigModule, RedisCacheModule, MemcachedCacheModule, MemoryCacheModule],
      providers: [CacheService],
      exports: [CacheService],
    };
  }
}
