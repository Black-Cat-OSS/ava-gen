import { Injectable, OnModuleInit, Logger, Optional } from '@nestjs/common';
import { Counter, Histogram, Gauge } from 'prom-client';
import { RedisCacheService } from '../cache/modules/redis-driver';
import { PrometheusService } from './prometheus.service';

/**
 * Сервис для сбора метрик Redis
 *
 * Собирает метрики:
 * - Статус подключения
 * - Операции (get, set, del и т.д.) и их latency
 * - Использование памяти
 * - Количество ключей
 * - Cache hits/misses
 * - Ошибки
 */
@Injectable()
export class RedisMetricsService implements OnModuleInit {
  private readonly logger = new Logger(RedisMetricsService.name);
  private isEnabled = false;

  public readonly redisConnectionStatus: Gauge<string>;
  public readonly redisOperationsTotal: Counter<string>;
  public readonly redisOperationDuration: Histogram<string>;
  public readonly redisMemoryUsed: Gauge<string>;
  public readonly redisMemoryLimit: Gauge<string>;
  public readonly redisMemoryUsagePercent: Gauge<string>;
  public readonly redisKeysCount: Gauge<string>;
  public readonly redisCacheHits: Counter<string>;
  public readonly redisCacheMisses: Counter<string>;
  public readonly redisErrors: Counter<string>;

  constructor(
    private readonly prometheusService: PrometheusService,
    @Optional() private readonly redisCacheService: RedisCacheService,
  ) {
    const register = this.prometheusService.getRegister();

    this.redisConnectionStatus = new Gauge({
      name: 'redis_connection_status',
      help: 'Redis connection status (1 = connected, 0 = disconnected)',
      registers: [register],
    });

    this.redisOperationsTotal = new Counter({
      name: 'redis_operations_total',
      help: 'Total number of Redis operations',
      labelNames: ['operation'],
      registers: [register],
    });

    this.redisOperationDuration = new Histogram({
      name: 'redis_operation_duration_seconds',
      help: 'Redis operation duration in seconds',
      labelNames: ['operation'],
      buckets: [0.0001, 0.0005, 0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
      registers: [register],
    });

    this.redisMemoryUsed = new Gauge({
      name: 'redis_memory_used_bytes',
      help: 'Redis memory used in bytes',
      registers: [register],
    });

    this.redisMemoryLimit = new Gauge({
      name: 'redis_memory_limit_bytes',
      help: 'Redis memory limit in bytes',
      registers: [register],
    });

    this.redisMemoryUsagePercent = new Gauge({
      name: 'redis_memory_usage_percent',
      help: 'Redis memory usage percentage',
      registers: [register],
    });

    this.redisKeysCount = new Gauge({
      name: 'redis_keys_count',
      help: 'Number of keys in Redis database',
      registers: [register],
    });

    this.redisCacheHits = new Counter({
      name: 'redis_cache_hits_total',
      help: 'Total number of Redis cache hits',
      registers: [register],
    });

    this.redisCacheMisses = new Counter({
      name: 'redis_cache_misses_total',
      help: 'Total number of Redis cache misses',
      registers: [register],
    });

    this.redisErrors = new Counter({
      name: 'redis_errors_total',
      help: 'Total number of Redis errors',
      labelNames: ['error_type'],
      registers: [register],
    });
  }

  async onModuleInit(): Promise<void> {
    if (!this.redisCacheService) {
      this.logger.log('RedisMetricsService skipped - Redis not configured');
      return;
    }

    try {
      this.isEnabled = true;
      this.logger.log('RedisMetricsService initialized - Redis metrics collection enabled');
      this.startMetricsCollection();
    } catch (error) {
      this.logger.error(`RedisMetricsService initialization failed: ${error.message}`, error.stack);
    }
  }

  /**
   * Запуск периодического сбора метрик
   */
  private startMetricsCollection(): void {
    setInterval(() => {
      this.collectMetrics();
    }, 15000);
  }

  /**
   * Сбор метрик Redis (память, ключи, статус)
   */
  private async collectMetrics(): Promise<void> {
    if (!this.isEnabled || !this.redisCacheService) {
      return;
    }

    try {
      const memoryStats = await this.redisCacheService.getMemoryUsage();

      this.redisMemoryUsed.set(memoryStats.used);
      this.redisMemoryLimit.set(memoryStats.limit);
      this.redisMemoryUsagePercent.set(memoryStats.percentage);
      this.redisKeysCount.set(memoryStats.itemCount || 0);
      this.redisConnectionStatus.set(1);
    } catch (error) {
      this.logger.warn(`Failed to collect Redis metrics: ${error.message}`);
      this.redisConnectionStatus.set(0);
      this.redisErrors.inc({ error_type: 'collection_error' });
    }
  }

  /**
   * Инкрементировать счетчик операций
   *
   * @param {string} operation - Тип операции (get, set, del и т.д.)
   */
  incrementOperation(operation: string): void {
    if (this.isEnabled) {
      this.redisOperationsTotal.inc({ operation });
    }
  }

  /**
   * Измерить latency операции
   *
   * @param {string} operation - Тип операции
   * @returns {() => void} Функция для завершения измерения
   */
  startOperationTimer(operation: string): () => void {
    if (!this.isEnabled) {
      return () => {};
    }

    return this.redisOperationDuration.startTimer({ operation });
  }

  /**
   * Записать cache hit
   */
  recordCacheHit(): void {
    if (this.isEnabled) {
      this.redisCacheHits.inc();
    }
  }

  /**
   * Записать cache miss
   */
  recordCacheMiss(): void {
    if (this.isEnabled) {
      this.redisCacheMisses.inc();
    }
  }

  /**
   * Записать ошибку Redis
   *
   * @param {string} errorType - Тип ошибки
   */
  recordError(errorType: string): void {
    if (this.isEnabled) {
      this.redisErrors.inc({ error_type: errorType });
    }
  }
}
