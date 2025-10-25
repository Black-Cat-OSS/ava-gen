import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EmojiGeneratorModule } from '../emoji-generator.module';
import { Logger } from '@nestjs/common';

// Mock dependencies
vi.mock('sharp', () => ({
  default: vi.fn(() => ({
    svg: vi.fn().mockReturnThis(),
    png: vi.fn().mockReturnThis(),
    composite: vi.fn().mockReturnThis(),
    toBuffer: vi.fn().mockResolvedValue(Buffer.from('mock-image-data')),
    resize: vi.fn().mockReturnThis(),
    extend: vi.fn().mockReturnThis(),
  })),
}));

vi.mock('twemoji-parser', () => ({
  parse: vi.fn((emoji: string) => {
    if (emoji === '😀') return ['1f600'];
    if (emoji === '🚀') return ['1f680'];
    return [];
  }),
}));

// Mock fetch for Twemoji CDN
global.fetch = vi.fn();

describe('EmojiGeneratorModule', () => {
  let emojiGenerator: EmojiGeneratorModule;
  let mockLogger: Logger;

  beforeEach(() => {
    mockLogger = {
      log: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
    } as any;

    emojiGenerator = new EmojiGeneratorModule();
    (emojiGenerator as any).logger = mockLogger;

    // Reset mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('checkTwemojiAvailability', () => {
    it('should return true when Twemoji CDN is available', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

      const result = await emojiGenerator.checkTwemojiAvailability();

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f600.svg',
        { method: 'HEAD' }
      );
    });

    it('should return false when Twemoji CDN is unavailable', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const result = await emojiGenerator.checkTwemojiAvailability();

      expect(result).toBe(false);
    });

    it('should return false when Twemoji CDN returns error status', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await emojiGenerator.checkTwemojiAvailability();

      expect(result).toBe(false);
    });
  });

  describe('generateAvatar', () => {
    beforeEach(() => {
      // Mock successful SVG fetch with proper response structure
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        text: () => Promise.resolve('<svg>mock-svg-content</svg>'),
      });
    });

    it('should generate emoji avatar with solid background', async () => {
      const result = await emojiGenerator.generateAvatar(
        '#3b82f6', // primaryColor
        '#ef4444', // foreignColor
        undefined, // colorScheme
        undefined, // seed
        90, // angle
        '😀', // emoji
        'solid', // backgroundType
        'large' // emojiSize
      );

      expect(result).toBeDefined();
      expect(result.meta_data_name).toBeDefined();
      expect(result.meta_data_created_at).toBeInstanceOf(Date);
      expect(result.meta_data_payload).toEqual({
        emoji: '😀',
        backgroundType: 'solid',
        emojiSize: 'large',
      });
      expect(result.image_4n).toBeInstanceOf(Buffer);
      expect(result.image_5n).toBeInstanceOf(Buffer);
      expect(result.image_6n).toBeInstanceOf(Buffer);
      expect(result.image_7n).toBeInstanceOf(Buffer);
      expect(result.image_8n).toBeInstanceOf(Buffer);
      expect(result.image_9n).toBeInstanceOf(Buffer);
    });

    it('should generate emoji avatar with linear background', async () => {
      const result = await emojiGenerator.generateAvatar(
        '#3b82f6', // primaryColor
        '#ef4444', // foreignColor
        undefined, // colorScheme
        undefined, // seed
        45, // angle
        '🚀', // emoji
        'linear', // backgroundType
        'medium' // emojiSize
      );

      expect(result).toBeDefined();
      expect(result.meta_data_payload).toEqual({
        emoji: '🚀',
        backgroundType: 'linear',
        emojiSize: 'medium',
        angle: 45,
      });
    });

    it('should generate emoji avatar with radial background', async () => {
      const result = await emojiGenerator.generateAvatar(
        '#3b82f6', // primaryColor
        '#ef4444', // foreignColor
        undefined, // colorScheme
        undefined, // seed
        90, // angle
        '😀', // emoji
        'radial', // backgroundType
        'small' // emojiSize
      );

      expect(result).toBeDefined();
      expect(result.meta_data_payload).toEqual({
        emoji: '😀',
        backgroundType: 'radial',
        emojiSize: 'small',
      });
    });

    it('should handle invalid emoji gracefully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(
        emojiGenerator.generateAvatar(
          '#3b82f6',
          '#ef4444',
          undefined,
          undefined,
          90,
          'invalid-emoji',
          'solid',
          'large'
        )
      ).rejects.toThrow();
    });

    it('should use default values when optional parameters are not provided', async () => {
      const result = await emojiGenerator.generateAvatar(
        '#3b82f6',
        '#ef4444',
        undefined,
        undefined,
        undefined,
        '😀',
        'solid',
        undefined
      );

      expect(result).toBeDefined();
      expect(result.meta_data_payload).toEqual({
        emoji: '😀',
        backgroundType: 'solid',
        emojiSize: 'large', // default value
      });
    });
  });

  describe('getColorSchemes', () => {
    it('should return default color schemes', () => {
      const schemes = emojiGenerator.getColorSchemes();

      expect(schemes).toBeDefined();
      expect(Array.isArray(schemes)).toBe(true);
      expect(schemes.length).toBeGreaterThan(0);
    });
  });

  describe('error handling', () => {
    it('should handle network errors during SVG fetch', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(
        emojiGenerator.generateAvatar(
          '#3b82f6',
          '#ef4444',
          undefined,
          undefined,
          90,
          '😀',
          'solid',
          'large'
        )
      ).rejects.toThrow('Network error');
    });

    it('should handle invalid SVG content', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        text: () => Promise.resolve('invalid-svg-content'),
      });

      await expect(
        emojiGenerator.generateAvatar(
          '#3b82f6',
          '#ef4444',
          undefined,
          undefined,
          90,
          '😀',
          'solid',
          'large'
        )
      ).rejects.toThrow();
    });
  });
});
