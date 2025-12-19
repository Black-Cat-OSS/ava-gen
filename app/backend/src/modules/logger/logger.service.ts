import { Injectable, LoggerService as NestLoggerService, Inject } from '@nestjs/common';
import pino from 'pino';
import { YamlConfigService } from '../../config/modules/yaml-driver/yaml-config.service';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: pino.Logger;

  constructor(
    @Inject(YamlConfigService)
    private readonly configService: YamlConfigService,
  ) {
    const loggingConfig = this.configService.getLoggingConfig();

    const logLevel = loggingConfig.level;
    const isVerbose = loggingConfig.verbose;
    const isPretty = loggingConfig.pretty;
    const effectiveLevel = isVerbose ? 'debug' : logLevel;

    // Определяем формат логирования
    const format = isPretty ? 'pretty' : 'json';

    let transport: pino.TransportTargetOptions | pino.TransportMultiOptions | undefined;

    if (format === 'pretty') {
      // Pretty формат для разработки
      transport = {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      };
    } else {
      // JSON формат для продакшена
      transport = {
        targets: [
          {
            target: 'pino-roll',
            level: effectiveLevel,
            options: {
              file: './logs/app.log',
              frequency: 'daily',
              size: '10M',
              limit: {
                count: 7,
              },
              mkdir: true,
            },
          },
          {
            target: 'pino/file',
            level: effectiveLevel,
            options: {
              destination: 1,
            },
          },
        ],
      };
    }

    this.logger = pino({
      level: effectiveLevel,
      transport,
    });

    if (isVerbose) {
      this.logger.debug('Verbose logging enabled');
    }

    this.logger.info(
      `Logger initialized: level=${effectiveLevel}, format=${format}, logFile=${format === 'json' ? './logs/app.log' : 'none'}`,
    );
  }

  log(message: string, context?: string) {
    this.logger.info({ context }, message);
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error({ context, trace }, message);
  }

  warn(message: string, context?: string) {
    this.logger.warn({ context }, message);
  }

  debug(message: string, context?: string) {
    this.logger.debug({ context }, message);
  }

  verbose(message: string, context?: string) {
    this.logger.trace({ context }, message);
  }
}
