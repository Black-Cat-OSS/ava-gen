import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { PrometheusService } from './prometheus.service';

/**
 * Interceptor для автоматического сбора HTTP метрик
 *
 * Собирает метрики:
 * - Общее количество запросов (http_requests_total)
 * - Latency запросов (http_request_duration_seconds)
 * - Активные запросы (http_active_requests)
 */
@Injectable()
export class PrometheusMetricsInterceptor implements NestInterceptor {
  constructor(private readonly prometheusService: PrometheusService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const route = request.route?.path || request.path;
    const method = request.method;
    const version = request.headers['accept-version'] || '1';

    if (route === '/metrics') {
      return next.handle();
    }

    this.prometheusService.httpActiveRequests.inc();

    const endTimer = this.prometheusService.httpRequestDuration.startTimer({
      method,
      route,
      status_code: '0',
      version: String(version),
    });

    return next.handle().pipe(
      tap(() => {
        const statusCode = String(response.statusCode);
        endTimer({
          method,
          route,
          status_code: statusCode,
          version: String(version),
        });

        this.prometheusService.httpRequestsTotal.inc({
          method,
          route,
          status_code: statusCode,
          version: String(version),
        });

        this.prometheusService.httpActiveRequests.dec();
      }),
      catchError(error => {
        const statusCode = String(error.status || 500);
        endTimer({
          method,
          route,
          status_code: statusCode,
          version: String(version),
        });

        this.prometheusService.httpRequestsTotal.inc({
          method,
          route,
          status_code: statusCode,
          version: String(version),
        });

        this.prometheusService.httpActiveRequests.dec();

        throw error;
      }),
    );
  }
}
