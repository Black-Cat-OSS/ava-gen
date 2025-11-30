import { Module } from '@nestjs/common';
import { PrometheusController } from './prometheus.controller';
import { PrometheusService } from './prometheus.service';
import { PrometheusMetricsInterceptor } from './prometheus-metrics.interceptor';
import { RedisMetricsService } from './redis-metrics.service';
import { ConfigModule } from '../../config/config.module';
import { CacheModule } from '../cache/cache.module';
import { RedisCacheModule } from '../cache/modules/redis-driver';

/**
 * Модуль Prometheus для сбора и экспорта метрик приложения
 *
 * Предоставляет:
 * - HTTP метрики (requests, latency)
 * - Метрики потребления ресурсов (CPU, память, event loop)
 * - Метрики Redis (операции, latency, память)
 * - Эндпоинт /metrics для Prometheus scraping
 */
@Module({
  imports: [ConfigModule, CacheModule, RedisCacheModule],
  controllers: [PrometheusController],
  providers: [PrometheusService, PrometheusMetricsInterceptor, RedisMetricsService],
  exports: [PrometheusService, PrometheusMetricsInterceptor],
})
export class PrometheusModule {}
