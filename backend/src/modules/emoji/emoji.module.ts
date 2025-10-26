import { Module } from '@nestjs/common';
import { EmojiService } from './emoji.service';
import { EmojiController } from './emoji.controller';

/**
 * Emoji module for handling emoji operations with Twemoji CDN
 */
@Module({
  providers: [EmojiService],
  controllers: [EmojiController],
  exports: [EmojiService],
})
export class EmojiModule {}
