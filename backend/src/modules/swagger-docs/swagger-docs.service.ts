import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OpenAPIObject } from '@nestjs/swagger';

@Injectable()
export class SwaggerDocsService {
  private readonly logger = new Logger(SwaggerDocsService.name);
  private document?: OpenAPIObject;

  setDocument(document: OpenAPIObject): void {
    this.document = document;
    this.logger.log('Swagger document initialized');
  }

  getDocument(): OpenAPIObject {
    if (!this.document) {
      this.logger.error('Swagger document is not initialized yet');
      throw new NotFoundException('Swagger documentation is not generated yet');
    }
    return this.document;
  }
}
