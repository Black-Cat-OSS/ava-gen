import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EmojiGeneratorModule } from '../emoji-generator.module';
import { Logger } from '@nestjs/common';
import { EmojiService } from '../../../../emoji';

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

// Mock EmojiService
const mockEmojiService = {
  fetchEmojiSvg: vi.fn(),
  rasterizeEmoji: vi.fn(),
  checkTwemojiAvailability: vi.fn(),
};

describe('EmojiGeneratorModule', () => {
  let emojiGenerator: EmojiGeneratorModule;
  let mockLogger: Logger;

  beforeEach(() => {
    mockLogger = {
      log: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
    } as any;

    emojiGenerator = new EmojiGeneratorModule(mockEmojiService as any);
    (emojiGenerator as any).logger = mockLogger;

    // Reset mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('checkTwemojiAvailability', () => {
    it('should return true when Twemoji CDN is available', async () => {
      mockEmojiService.checkTwemojiAvailability.mockResolvedValue(true);

      const result = await emojiGenerator.checkTwemojiAvailability();

      expect(result).toBe(true);
      expect(mockEmojiService.checkTwemojiAvailability).toHaveBeenCalledTimes(1);
    });

    it('should return false when Twemoji CDN is unavailable', async () => {
      mockEmojiService.checkTwemojiAvailability.mockResolvedValue(false);

      const result = await emojiGenerator.checkTwemojiAvailability();

      expect(result).toBe(false);
      expect(mockEmojiService.checkTwemojiAvailability).toHaveBeenCalledTimes(1);
    });
  });

  describe('generateAvatar', () => {
    beforeEach(() => {
      // Mock EmojiService methods
      mockEmojiService.fetchEmojiSvg.mockResolvedValue(Buffer.from('<svg>mock-svg-content</svg>'));
      mockEmojiService.rasterizeEmoji.mockResolvedValue(Buffer.from('mock-rasterized-emoji'));
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
        angle: 90,
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
        angle: 90,
      });
    });

    it('should handle invalid emoji gracefully', async () => {
      mockEmojiService.fetchEmojiSvg.mockRejectedValue(new Error('Invalid emoji'));

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
      ).rejects.toThrow('Invalid emoji');
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
      mockEmojiService.fetchEmojiSvg.mockRejectedValue(new Error('Network error'));

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
      mockEmojiService.fetchEmojiSvg.mockResolvedValue(Buffer.from('invalid-svg-content'));
      mockEmojiService.rasterizeEmoji.mockRejectedValue(new Error('Invalid SVG'));

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
      ).rejects.toThrow('Invalid SVG');
    });
  });
});
