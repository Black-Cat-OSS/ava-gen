import { Inject, Injectable, Logger, NotFoundException, StreamableFile } from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import { SWAGGER_DOC_PATH } from './constants';

@Injectable()
export class SwaggerDocsService {
  private readonly logger = new Logger(SwaggerDocsService.name);

  constructor(@Inject(SWAGGER_DOC_PATH) private readonly swaggerDocPath: string) {}

  getDocument(): StreamableFile {
    if (!existsSync(this.swaggerDocPath)) {
      this.logger.error(
        `Swagger document not found at ${this.swaggerDocPath}. Run "pnpm build" in backend to regenerate static/swagger.json.`,
      );
      throw new NotFoundException('Swagger documentation is not generated yet');
    }

    return new StreamableFile(createReadStream(this.swaggerDocPath), {
      type: 'application/json',
      disposition: 'inline; filename="swagger.json"',
    });
  }
}
