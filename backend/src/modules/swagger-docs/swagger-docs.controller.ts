import { Controller, Get, Header, VERSION_NEUTRAL } from '@nestjs/common';
import { StreamableFile } from '@nestjs/common';
import { SwaggerDocsService } from './swagger-docs.service';

@Controller({
  path: 'swagger/docs',
  version: VERSION_NEUTRAL,
})
export class SwaggerDocsController {
  constructor(private readonly swaggerDocsService: SwaggerDocsService) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  getSwaggerDocument(): StreamableFile {
    return this.swaggerDocsService.getDocument();
  }
}
