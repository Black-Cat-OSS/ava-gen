import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { OpenAPIObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function buildSwaggerDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('Avatar Generation API')
    .setDescription('API for generating and managing avatars similar to GitHub/GitLab')
    .setVersion('1.0.0')
    .addTag('Avatar', 'Avatar generation and management endpoints')
    .build();
  return SwaggerModule.createDocument(app, config);
}
