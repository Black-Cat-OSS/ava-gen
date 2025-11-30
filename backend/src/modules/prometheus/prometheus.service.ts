import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
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
export class PrometheusService implements OnModuleInit {
  private readonly logger = new Logger(PrometheusService.name);
  private readonly register: Registry;

  public readonly httpRequestsTotal: Counter<string>;
  public readonly httpRequestDuration: Histogram<string>;
  public readonly httpActiveRequests: Gauge<string>;

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
  }

  async onModuleInit(): Promise<void> {
    try {
      collectDefaultMetrics({
        register: this.register,
        prefix: 'app_',
      });

      this.logger.log('PrometheusService initialized - Metrics collection enabled');
    } catch (error) {
      this.logger.error(`PrometheusService initialization failed: ${error.message}`, error.stack);
      throw error;
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
