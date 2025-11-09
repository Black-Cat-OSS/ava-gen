import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { OpenAPIObject } from '@nestjs/swagger';

@Injectable()
export class SwaggerDocsService {
  private readonly logger = new Logger(SwaggerDocsService.name);
  private document?: OpenAPIObject;

  initialize(app: INestApplication): OpenAPIObject {
    const document = this.createDocument(app);
    this.setDocument(document);

    const httpAdapter = app.getHttpAdapter();
    httpAdapter.get('/swagger/json', (req, res) => {
      res.type('application/json; charset=utf-8');
      res.send(document);
    });

    this.logger.log('Swagger routes registered');
    return document;
  }

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

  private createDocument(app: INestApplication): OpenAPIObject {
    const config = new DocumentBuilder()
      .setTitle('Avatar Generation API')
      .setDescription('API for generating and managing avatars similar to GitHub/GitLab')
      .setVersion('1.0.0')
      .addTag('Avatar', 'Avatar generation and management endpoints')
      .build();

    return SwaggerModule.createDocument(app, config);
  }
}
