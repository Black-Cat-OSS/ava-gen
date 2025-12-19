import { Module } from '@nestjs/common';
import { CorsMiddleware } from './cors.middleware';
import { ConfigModule } from '../../config/config.module';

/**
 * Модуль для настройки CORS middleware
 *
 * CORS middleware применяется через Express адаптер в main.ts,
 * чтобы избежать создания wildcard маршрута, который вызывает
 * предупреждение в Swagger/path-to-regexp
 */
@Module({
  imports: [ConfigModule],
  providers: [CorsMiddleware],
  exports: [CorsMiddleware],
})
export class CorsMiddlewareModule {}
