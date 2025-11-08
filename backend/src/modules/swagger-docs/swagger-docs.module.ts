import { Module } from '@nestjs/common';
import { SwaggerDocsController } from './swagger-docs.controller';
import { SwaggerDocsService } from './swagger-docs.service';
import { SWAGGER_DOC_PATH } from './constants';
import { join } from 'path';

@Module({
  controllers: [SwaggerDocsController],
  providers: [
    SwaggerDocsService,
    {
      provide: SWAGGER_DOC_PATH,
      useFactory: () => join(process.cwd(), 'static', 'swagger.json'),
    },
  ],
  exports: [SwaggerDocsService],
})
export class SwaggerDocsModule {}
