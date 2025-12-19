import { Controller, Get, Header, VERSION_NEUTRAL } from '@nestjs/common';
import { OpenAPIObject } from '@nestjs/swagger';
import { SwaggerDocsService } from './swagger-docs.service';

@Controller({
  path: 'swagger/docs',
  version: VERSION_NEUTRAL,
})
export class SwaggerDocsController {
  constructor(private readonly swaggerDocsService: SwaggerDocsService) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @Header('Content-Type', 'application/json; charset=utf-8')
  getSwaggerDocument(): OpenAPIObject {
    return this.swaggerDocsService.getDocument();
  }
}
