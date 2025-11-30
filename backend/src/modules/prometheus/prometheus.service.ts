import { Injectable, OnModuleInit, Logger, OnModuleDestroy } from '@nestjs/common';
import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

/**
 * Сервис для управления метриками Prometheus
 *
 * Инициализирует и управляет всеми метриками приложения:
 * - HTTP метрики (requests, latency)
 * - Метрики потребления ресурсов (CPU, память, event loop)
 * - Стандартные метрики Node.js
 */
@Injectable()
export class PrometheusService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrometheusService.name);
  private readonly register: Registry;
  private metricsInterval: NodeJS.Timeout | null = null;

  public readonly httpRequestsTotal: Counter<string>;
  public readonly httpRequestDuration: Histogram<string>;
  public readonly httpActiveRequests: Gauge<string>;
  public readonly appMemoryRss: Gauge<string>;
  public readonly appMemoryHeapTotal: Gauge<string>;
  public readonly appMemoryHeapUsed: Gauge<string>;
  public readonly appMemoryHeapAvailable: Gauge<string>;
  public readonly appMemoryExternal: Gauge<string>;
  public readonly appUptime: Gauge<string>;

  constructor() {
    this.register = new Registry();

    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code', 'version'],
      registers: [this.register],
    });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'route', 'status_code', 'version'],
      buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
      registers: [this.register],
    });

    this.httpActiveRequests = new Gauge({
      name: 'http_active_requests',
      help: 'Number of active HTTP requests',
      registers: [this.register],
    });

    this.appMemoryRss = new Gauge({
      name: 'app_memory_rss_bytes',
      help: 'Resident Set Size memory in bytes',
      registers: [this.register],
    });

    this.appMemoryHeapTotal = new Gauge({
      name: 'app_memory_heap_total_bytes',
      help: 'Total heap memory in bytes',
      registers: [this.register],
    });

    this.appMemoryHeapUsed = new Gauge({
      name: 'app_memory_heap_used_bytes',
      help: 'Used heap memory in bytes',
      registers: [this.register],
    });

    this.appMemoryHeapAvailable = new Gauge({
      name: 'app_memory_heap_available_bytes',
      help: 'Available heap memory in bytes',
      registers: [this.register],
    });

    this.appMemoryExternal = new Gauge({
      name: 'app_memory_external_bytes',
      help: 'External memory in bytes',
      registers: [this.register],
    });

    this.appUptime = new Gauge({
      name: 'app_uptime_seconds',
      help: 'Application uptime in seconds',
      registers: [this.register],
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      collectDefaultMetrics({
        register: this.register,
        prefix: 'app_',
      });

      this.startResourceMetricsCollection();

      this.logger.log('PrometheusService initialized - Metrics collection enabled');
    } catch (error) {
      this.logger.error(`PrometheusService initialization failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }
  }

  /**
   * Запуск периодического сбора метрик ресурсов
   */
  private startResourceMetricsCollection(): void {
    this.collectResourceMetrics();

    this.metricsInterval = setInterval(() => {
      this.collectResourceMetrics();
    }, 15000);
  }

  /**
   * Сбор метрик потребления ресурсов
   */
  private collectResourceMetrics(): void {
    try {
      const memUsage = process.memoryUsage();

      this.appMemoryRss.set(memUsage.rss);
      this.appMemoryHeapTotal.set(memUsage.heapTotal);
      this.appMemoryHeapUsed.set(memUsage.heapUsed);
      this.appMemoryHeapAvailable.set(memUsage.heapTotal - memUsage.heapUsed);
      this.appMemoryExternal.set(memUsage.external);
      this.appUptime.set(Math.floor(process.uptime()));
    } catch (error) {
      this.logger.warn(`Failed to collect resource metrics: ${error.message}`);
    }
  }

  /**
   * Получить все метрики в формате Prometheus
   *
   * @returns {Promise<string>} Метрики в текстовом формате Prometheus
   */
  async getMetrics(): Promise<string> {
    return await this.register.metrics();
  }

  /**
   * Получить регистр метрик
   *
   * @returns {Registry} Регистр Prometheus
   */
  getRegister(): Registry {
    return this.register;
  }
}
