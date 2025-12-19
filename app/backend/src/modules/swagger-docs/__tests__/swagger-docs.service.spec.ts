import { afterEach, describe, expect, it, vi } from 'vitest';
import { SwaggerDocsService } from '../swagger-docs.service';
import { NotFoundException, StreamableFile } from '@nestjs/common';
import { Readable } from 'stream';
import * as fs from 'fs';

vi.mock('fs', async () => {
  const actual = await vi.importActual<typeof fs>('fs');
  return {
    ...actual,
    existsSync: vi.fn(),
    createReadStream: vi.fn(),
  };
});

describe('SwaggerDocsService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns stream when swagger document exists', () => {
    const filePath = '/tmp/swagger.json';
    const stream = Readable.from(JSON.stringify({ openapi: '3.0.0' }));
    const existsSpy = fs.existsSync as unknown as vi.Mock;
    const readStreamSpy = fs.createReadStream as unknown as vi.Mock;
    existsSpy.mockReturnValue(true);
    readStreamSpy.mockReturnValue(stream as unknown as fs.ReadStream);
    const service = new SwaggerDocsService(filePath);

    const result = service.getDocument();

    expect(result).toBeInstanceOf(StreamableFile);
    expect(existsSpy).toHaveBeenCalledWith(filePath);
    expect(readStreamSpy).toHaveBeenCalledWith(filePath);
    expect(result.getStream()).toBe(stream);
  });

  it('throws NotFoundException when file missing', () => {
    const existsSpy = fs.existsSync as unknown as vi.Mock;
    existsSpy.mockReturnValue(false);
    const service = new SwaggerDocsService('/missing/swagger.json');

    expect(() => service.getDocument()).toThrow(NotFoundException);
  });
});
