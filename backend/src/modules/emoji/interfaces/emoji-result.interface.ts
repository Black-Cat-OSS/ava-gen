/**
 * Result of emoji processing
 */
export interface EmojiResult {
  /** The emoji string that was processed */
  emoji: string;
  /** SVG content as Buffer */
  svgBuffer: Buffer;
  /** Rasterized PNG as Buffer */
  pngBuffer?: Buffer;
  /** Processing timestamp */
  processedAt: Date;
  /** Whether the emoji was cached */
  fromCache: boolean;
}

/**
 * Health check result for Twemoji CDN
 */
export interface EmojiHealthResult {
  /** Whether Twemoji CDN is available */
  available: boolean;
  /** Last check timestamp */
  lastChecked: Date;
  /** Response time in milliseconds */
  responseTime?: number;
  /** Error message if unavailable */
  error?: string;
}
