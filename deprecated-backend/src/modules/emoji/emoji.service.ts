import { Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';
import { EmojiOptions, EmojiResult, EmojiHealthResult, EmojiRasterizeOptions } from './interfaces';

/**
 * Service for handling emoji operations with Twemoji CDN
 */
@Injectable()
export class EmojiService {
  private readonly logger = new Logger(EmojiService.name);
  private readonly cache = new Map<string, EmojiResult>();
  private readonly twemojiBaseUrl =
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/';

  /**
   * Convert emoji to unicode codepoint(s)
   * @param emoji - The emoji string
   * @returns Array of codepoint strings
   */
  private getEmojiCodepoints(emoji: string): string[] {
    const codePoints: string[] = [];
    for (let i = 0; i < emoji.length; i++) {
      const codePoint = emoji.codePointAt(i);
      if (codePoint !== undefined) {
        codePoints.push(codePoint.toString(16));
        // Skip the next character if this is a surrogate pair
        if (codePoint > 0xffff) {
          i++;
        }
      }
    }
    return codePoints;
  }

  /**
   * Get Twemoji filename for emoji
   * @param emoji - The emoji string
   * @returns Filename without extension
   */
  private getEmojiFilename(emoji: string): string {
    return this.getEmojiCodepoints(emoji).join('-');
  }

  /**
   * Fetch emoji SVG from Twemoji CDN
   * @param emoji - The emoji string to fetch
   * @param options - Processing options
   * @returns Promise<Buffer> - SVG content as Buffer
   */
  async fetchEmojiSvg(emoji: string, options: EmojiOptions = {}): Promise<Buffer> {
    const cacheKey = `svg:${emoji}`;

    // Check cache first
    if (options.cache !== false && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      this.logger.debug(`Using cached SVG for emoji: ${emoji}`);
      return cached.svgBuffer;
    }

    try {
      const filename = this.getEmojiFilename(emoji);
      this.logger.debug(`Extracted filename for emoji ${emoji}: ${filename}`);

      const svgUrl = `${this.twemojiBaseUrl}${filename}.svg`;
      this.logger.debug(`Fetching emoji SVG from: ${svgUrl}`);

      let response = await fetch(svgUrl);
      
      // If the emoji with variation selector is not found, try without it
      if (!response.ok && emoji.includes('\uFE0F')) {
        const emojiWithoutVS = emoji.replace(/\uFE0F/g, '');
        const fallbackFilename = this.getEmojiFilename(emojiWithoutVS);
        const fallbackUrl = `${this.twemojiBaseUrl}${fallbackFilename}.svg`;
        this.logger.debug(`Trying fallback without variation selector: ${fallbackUrl}`);
        
        response = await fetch(fallbackUrl);
        if (response.ok) {
          this.logger.debug(`Successfully fetched emoji without variation selector`);
        }
      }
      
      if (!response.ok) {
        this.logger.error(
          `Failed to fetch emoji SVG from ${svgUrl}: ${response.status} ${response.statusText}`,
        );
        throw new Error(`Failed to fetch emoji SVG: ${response.status} ${response.statusText}`);
      }

      const svgText = await response.text();
      const svgBuffer = Buffer.from(svgText, 'utf-8');

      if (options.cache !== false) {
        this.cache.set(cacheKey, {
          emoji,
          svgBuffer,
          processedAt: new Date(),
          fromCache: false,
        });
      }

      this.logger.debug(`Successfully fetched SVG for emoji: ${emoji}`);
      return svgBuffer;
    } catch (error) {
      this.logger.error(`Failed to fetch emoji SVG for ${emoji}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Rasterize SVG emoji to PNG
   * @param svgBuffer - SVG content as Buffer
   * @param options - Rasterization options
   * @returns Promise<Buffer> - PNG content as Buffer
   */
  async rasterizeEmoji(svgBuffer: Buffer, options: EmojiRasterizeOptions): Promise<Buffer> {
    try {
      this.logger.debug(
        `Rasterizing emoji SVG to ${options.width}x${options.height} PNG (format: ${options.format || 'png'})`,
      );

      const pngBuffer = await sharp(svgBuffer)
        .resize(options.width, options.height, {
          fit: 'contain',
          background: options.backgroundColor || { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();

      this.logger.debug(`Successfully rasterized emoji to ${options.width}x${options.height} PNG`);
      return pngBuffer;
    } catch (error) {
      this.logger.error(
        `Failed to rasterize emoji to ${options.width}x${options.height}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Check Twemoji CDN availability
   * @returns Promise<boolean> - Whether the CDN is available
   */
  async checkTwemojiAvailability(): Promise<boolean> {
    const testEmoji = '😀';
    const filename = this.getEmojiFilename(testEmoji);
    this.logger.debug(`Health check filename for ${testEmoji}: ${filename}`);

    const testUrl = `${this.twemojiBaseUrl}${filename}.svg`;

    try {
      const startTime = Date.now();
      const response = await fetch(testUrl, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
      });
      const responseTime = Date.now() - startTime;

      const isAvailable = response.ok;

      if (!isAvailable) {
        this.logger.warn(
          `Twemoji CDN is not available at ${testUrl}: ${response.status} ${response.statusText}`,
        );
      } else {
        this.logger.debug(`Twemoji CDN is available at ${testUrl} (${responseTime}ms)`);
      }

      return isAvailable;
    } catch (error) {
      this.logger.warn(`Twemoji CDN availability check failed for ${testUrl}: ${error.message}`);
      return false;
    }
  }

  /**
   * Get detailed health information about Twemoji CDN
   * @returns Promise<EmojiHealthResult> - Detailed health information
   */
  async getHealthInfo(): Promise<EmojiHealthResult> {
    const startTime = Date.now();

    try {
      const available = await this.checkTwemojiAvailability();
      const responseTime = Date.now() - startTime;

      this.logger.debug(
        `Health check completed: ${available ? 'available' : 'unavailable'} (${responseTime}ms)`,
      );

      return {
        available,
        lastChecked: new Date(),
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.logger.error(`Health check failed: ${error.message} (${responseTime}ms)`);

      return {
        available: false,
        lastChecked: new Date(),
        responseTime,
        error: error.message,
      };
    }
  }

  /**
   * Clear emoji cache
   */
  clearCache(): void {
    this.cache.clear();
    this.logger.debug('Emoji cache cleared');
  }

  /**
   * Get cache statistics
   * @returns Object with cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}
