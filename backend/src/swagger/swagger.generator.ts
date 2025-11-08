import { NestFactory } from '@nestjs/core';
import { AppModule } from '../modules/app/app.module';
import { buildSwaggerDocument } from './swagger.factory';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

export async function generateSwaggerDocument(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: false });
  try {
    await app.init();
    const document = buildSwaggerDocument(app);
    const staticDir = join(process.cwd(), 'static');
    mkdirSync(staticDir, { recursive: true });
    const outputPath = join(staticDir, 'swagger.json');
    writeFileSync(outputPath, JSON.stringify(document, null, 2), { encoding: 'utf-8' });
  } finally {
    await app.close();
  }
}

export async function runSwaggerGenerator(): Promise<void> {
  await generateSwaggerDocument();
}
