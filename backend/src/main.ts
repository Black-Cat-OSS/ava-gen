import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, VersioningType, RequestMethod } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app/app.module';
import { YamlConfigService } from './config/modules/yaml-driver/yaml-config.service';
import { LoggerService } from './modules/logger/logger.service';
import { EmptyResponseInterceptor } from './common/interceptors/empty-response.interceptor';
import { Reflector } from '@nestjs/core';
import { SwaggerDocsService } from './modules/swagger-docs';
import { CorsMiddleware } from './middleware/cors/cors.middleware';

async function bootstrap() {
  const bootstrapLogger = new Logger('Bootstrap');

  try {
    bootstrapLogger.log('Starting application bootstrap...');

    bootstrapLogger.log('Creating NestJS application instance...');
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
    });
    bootstrapLogger.log('Application instance created');

    bootstrapLogger.log('Getting configuration and logger services...');
    const configService = app.get(YamlConfigService);
    bootstrapLogger.debug('Config service retrieved');

    const loggerService = app.get(LoggerService);
    bootstrapLogger.debug('Logger service retrieved');

    app.useLogger(loggerService);
    bootstrapLogger.log('Global logger configured');

    loggerService.log('Application bootstrap completed successfully');

    loggerService.debug('Setting up CORS middleware...');
    const corsMiddleware = app.get(CorsMiddleware);
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.use((req, res, next) => {
      corsMiddleware.use(req, res, next);
    });
    loggerService.debug('CORS middleware configured');

    loggerService.debug('Setting global API prefix...');
    app.setGlobalPrefix('api', {
      exclude: [{ path: 'swagger/docs', method: RequestMethod.GET }],
    });

    loggerService.debug('Enabling API versioning...');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    loggerService.debug('Setting up global validation pipe...');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    loggerService.debug('Setting up global empty response interceptor...');
    app.useGlobalInterceptors(new EmptyResponseInterceptor(app.get(Reflector)));

    loggerService.debug('Setting up Swagger documentation...');
    const swaggerDocsService = app.get(SwaggerDocsService);
    const document = swaggerDocsService.initialize(app);

    SwaggerModule.setup('swagger', app, document, {
      customSiteTitle: 'Avatar Generation API',
    });

    const serverConfig = configService.getServerConfig();
    loggerService.debug(`Server configuration: ${JSON.stringify(serverConfig)}`);

    loggerService.log(`Starting server on ${serverConfig.host}:${serverConfig.port}...`);
    await app.listen(serverConfig.port, serverConfig.host);

    loggerService.log(
      `Application is running on: http://${serverConfig.host}:${serverConfig.port}`,
    );
    loggerService.log(
      `Swagger documentation available at: http://${serverConfig.host}:${serverConfig.port}/swagger`,
    );
  } catch (error) {
    bootstrapLogger.error(`Failed to start application: ${error.message}`, error.stack);
    process.exit(1);
  }
}

bootstrap();
