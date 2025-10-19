import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';

export const SKIP_EMPTY_CHECK = 'skipEmptyCheck';
export const SkipEmptyCheck = () => SetMetadata(SKIP_EMPTY_CHECK, true);

@Injectable()
export class EmptyResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const skipCheck = this.reflector.get<boolean>(
      SKIP_EMPTY_CHECK,
      context.getHandler(),
    );

    if (skipCheck) {
      return next.handle();
    }

    return next.handle().pipe(
      map(data => {
        const response = context.switchToHttp().getResponse();
        
        // Check if data is empty array or empty object
        const isEmpty = 
          (Array.isArray(data) && data.length === 0) ||
          (typeof data === 'object' && data !== null && Object.keys(data).length === 0);

        if (isEmpty) {
          response.status(HttpStatus.NO_CONTENT);
          return undefined;
        }

        return data;
      }),
    );
  }
}

