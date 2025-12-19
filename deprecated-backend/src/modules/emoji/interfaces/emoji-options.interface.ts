/**
 * Options for emoji processing
 */
export interface EmojiOptions {
  /** Size of the emoji in pixels */
  size?: number;
  /** Whether to cache the emoji */
  cache?: boolean;
  /** Custom Twemoji CDN URL */
  cdnUrl?: string;
}

/**
 * Options for emoji rasterization
 */
export interface EmojiRasterizeOptions {
  /** Target width in pixels */
  width: number;
  /** Target height in pixels */
  height: number;
  /** Background color for transparent areas */
  backgroundColor?: string;
  /** Output format */
  format?: 'png' | 'jpeg' | 'webp';
}
