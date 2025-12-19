import { Controller, Get, VERSION_NEUTRAL, Header } from '@nestjs/common';
import { PrometheusService } from './prometheus.service';

/**
 * Контроллер для экспорта метрик Prometheus
 *
 * Предоставляет эндпоинт /metrics для сбора метрик Prometheus сервером
 */
@Controller({ path: 'metrics', version: VERSION_NEUTRAL })
export class PrometheusController {
  constructor(private readonly prometheusService: PrometheusService) {}

  /**
   * Эндпоинт для экспорта метрик в формате Prometheus
   *
   * @returns {Promise<string>} Метрики в формате Prometheus
   */
  @Get()
  @Header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
  async getMetrics(): Promise<string> {
    return await this.prometheusService.getMetrics();
  }
}
