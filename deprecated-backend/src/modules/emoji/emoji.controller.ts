import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmojiService } from './emoji.service';
import { EmojiHealthResult } from './interfaces';

/**
 * Controller for emoji-related operations
 */
@ApiTags('emoji')
@Controller('emoji')
export class EmojiController {
  constructor(private readonly emojiService: EmojiService) {}

  /**
   * Health check for Twemoji CDN service
   * @returns Promise<EmojiHealthResult> - Health information
   */
  @Get('health')
  @ApiOperation({ 
    summary: 'Check Twemoji CDN availability',
    description: 'Returns the availability status of the Twemoji CDN service'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Health check completed successfully',
    schema: {
      type: 'object',
      properties: {
        available: { type: 'boolean', description: 'Whether Twemoji CDN is available' },
        lastChecked: { type: 'string', format: 'date-time', description: 'Last check timestamp' },
        responseTime: { type: 'number', description: 'Response time in milliseconds' },
        error: { type: 'string', description: 'Error message if unavailable' }
      }
    }
  })
  async healthCheck(): Promise<EmojiHealthResult> {
    return await this.emojiService.getHealthInfo();
  }
}
