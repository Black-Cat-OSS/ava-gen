import { describe, expect, it, vi } from 'vitest';
import { SwaggerDocsController } from '../swagger-docs.controller';
import { SwaggerDocsService } from '../swagger-docs.service';
import { StreamableFile } from '@nestjs/common';

describe('SwaggerDocsController', () => {
  it('returns swagger document from service', async () => {
    const streamable = new StreamableFile(Buffer.from('{}'));
    const serviceMock = {
      getDocument: vi.fn().mockReturnValue(streamable),
    } as unknown as SwaggerDocsService;
    const controller = new SwaggerDocsController(serviceMock);

    const result = controller.getSwaggerDocument();

    expect(result).toBe(streamable);
  });
});
