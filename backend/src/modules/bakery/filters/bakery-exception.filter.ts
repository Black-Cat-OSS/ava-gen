import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { BakeryException } from '../exceptions/bakery.exception';

/**
 * Global exception filter for Bakery module
 * Handles all Bakery-related exceptions and provides consistent error responses
 */
@Catch(BakeryException)
export class BakeryExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BakeryExceptionFilter.name);

  catch(exception: BakeryException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status = exception.getStatus();
    const message = exception.message;

    // Log the error with context
    this.logger.error(
      `Bakery exception: ${message}`,
      {
        statusCode: status,
        path: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
        exceptionType: exception.constructor.name,
        stack: exception.stack,
      },
    );

    // Prepare error response
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
      error: this.getErrorType(status),
      details: this.getErrorDetails(exception),
    };

    response.status(status).json(errorResponse);
  }

  private getErrorType(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad Request';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'Internal Server Error';
      default:
        return 'Error';
    }
  }

  private getErrorDetails(exception: BakeryException): Record<string, unknown> {
    const details: Record<string, unknown> = {
      module: 'Bakery',
      exceptionType: exception.constructor.name,
    };

    // Add specific details based on exception type
    if (exception.cause) {
      details.cause = exception.cause.message;
    }

    return details;
  }
}

/**
 * Global exception filter for all exceptions (fallback)
 * Catches any unhandled exceptions and provides generic error response
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : HttpStatus.INTERNAL_SERVER_ERROR;
    
    const message = exception instanceof HttpException 
      ? exception.message 
      : 'Internal server error';

    // Log the error
    this.logger.error(
      `Unhandled exception: ${message}`,
      {
        statusCode: status,
        path: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
        exceptionType: exception.constructor.name,
        stack: exception.stack,
      },
    );

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
      error: this.getErrorType(status),
    };

    response.status(status).json(errorResponse);
  }

  private getErrorType(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad Request';
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized';
      case HttpStatus.FORBIDDEN:
        return 'Forbidden';
      case HttpStatus.NOT_FOUND:
        return 'Not Found';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'Internal Server Error';
      default:
        return 'Error';
    }
  }
}
