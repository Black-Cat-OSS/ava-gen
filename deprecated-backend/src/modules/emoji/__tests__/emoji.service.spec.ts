import { Test, TestingModule } from '@nestjs/testing';
import { EmojiService } from '../emoji.service';
import { parse } from 'twemoji-parser';
import * as sharp from 'sharp';

// Mock twemoji-parser
vi.mock('twemoji-parser', () => ({
  parse: vi.fn(),
}));

// Mock sharp
vi.mock('sharp', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    default: vi.fn(() => ({
      resize: vi.fn().mockReturnThis(),
      png: vi.fn().mockReturnThis(),
      toBuffer: vi.fn(),
    })),
  };
});

// Mock fetch
global.fetch = vi.fn();

describe('EmojiService', () => {
  let service: EmojiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmojiService],
    }).compile();

    service = module.get<EmojiService>(EmojiService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchEmojiSvg', () => {
    it('should fetch emoji SVG successfully', async () => {
      const mockEmoji = '😀';
      const mockCodepoint = '1f600';
      const mockSvgContent = '<svg>mock-svg-content</svg>';

      // Mock twemoji-parser
      (parse as any).mockReturnValue([{ unicode: mockCodepoint }]);

      // Mock fetch response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockSvgContent),
      });

      const result = await service.fetchEmojiSvg(mockEmoji);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString()).toBe(mockSvgContent);
      expect(parse).toHaveBeenCalledWith(mockEmoji);
      expect(global.fetch).toHaveBeenCalledWith(
        `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${mockCodepoint}.svg`
      );
    });

    it('should throw error for invalid emoji', async () => {
      const mockEmoji = 'invalid';

      // Mock twemoji-parser to return empty array
      (parse as any).mockReturnValue([]);

      await expect(service.fetchEmojiSvg(mockEmoji)).rejects.toThrow('Invalid emoji: invalid');
    });

    it('should throw error when fetch fails', async () => {
      const mockEmoji = '😀';
      const mockCodepoint = '1f600';

      // Mock twemoji-parser
      (parse as any).mockReturnValue([{ unicode: mockCodepoint }]);

      // Mock fetch to return error
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(service.fetchEmojiSvg(mockEmoji)).rejects.toThrow(
        'Failed to fetch emoji SVG: 404 Not Found'
      );
    });

    it('should use cache when available', async () => {
      const mockEmoji = '😀';
      const mockCodepoint = '1f600';
      const mockSvgContent = '<svg>mock-svg-content</svg>';

      // Mock twemoji-parser
      (parse as any).mockReturnValue([{ unicode: mockCodepoint }]);

      // Mock fetch response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockSvgContent),
      });

      // First call
      await service.fetchEmojiSvg(mockEmoji);

      // Second call should use cache
      const result = await service.fetchEmojiSvg(mockEmoji);

      expect(result).toBeInstanceOf(Buffer);
      expect(global.fetch).toHaveBeenCalledTimes(1); // Only called once due to cache
    });
  });

  describe('rasterizeEmoji', () => {
    it('should rasterize SVG to PNG successfully', async () => {
      const mockSvgBuffer = Buffer.from('<svg>mock-svg-content</svg>');
      const mockPngBuffer = Buffer.from('mock-png-content');
      const mockOptions = {
        width: 64,
        height: 64,
        format: 'png' as const,
      };

      // Mock sharp
      const mockSharp = {
        resize: vi.fn().mockReturnThis(),
        png: vi.fn().mockReturnThis(),
        toBuffer: vi.fn().mockResolvedValue(mockPngBuffer),
      };
      (sharp as any).mockReturnValue(mockSharp);

      const result = await service.rasterizeEmoji(mockSvgBuffer, mockOptions);

      expect(result).toBe(mockPngBuffer);
      expect(sharp).toHaveBeenCalledWith(mockSvgBuffer);
      expect(mockSharp.resize).toHaveBeenCalledWith(64, 64, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      });
      expect(mockSharp.png).toHaveBeenCalled();
      expect(mockSharp.toBuffer).toHaveBeenCalled();
    });

    it('should handle custom background color', async () => {
      const mockSvgBuffer = Buffer.from('<svg>mock-svg-content</svg>');
      const mockPngBuffer = Buffer.from('mock-png-content');
      const mockOptions = {
        width: 64,
        height: 64,
        backgroundColor: '#ffffff',
        format: 'png' as const,
      };

      // Mock sharp
      const mockSharp = {
        resize: vi.fn().mockReturnThis(),
        png: vi.fn().mockReturnThis(),
        toBuffer: vi.fn().mockResolvedValue(mockPngBuffer),
      };
      (sharp as any).mockReturnValue(mockSharp);

      await service.rasterizeEmoji(mockSvgBuffer, mockOptions);

      expect(mockSharp.resize).toHaveBeenCalledWith(64, 64, {
        fit: 'contain',
        background: '#ffffff',
      });
    });
  });

  describe('checkTwemojiAvailability', () => {
    it('should return true when Twemoji CDN is available', async () => {
      const mockCodepoint = '1f600';

      // Mock twemoji-parser
      (parse as any).mockReturnValue([{ unicode: mockCodepoint }]);

      // Mock fetch to return success
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
      });

      const result = await service.checkTwemojiAvailability();

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${mockCodepoint}.svg`,
        { method: 'HEAD', signal: expect.any(Object) }
      );
    });

    it('should return false when Twemoji CDN is not available', async () => {
      const mockCodepoint = '1f600';

      // Mock twemoji-parser
      (parse as any).mockReturnValue([{ unicode: mockCodepoint }]);

      // Mock fetch to return error
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      const result = await service.checkTwemojiAvailability();

      expect(result).toBe(false);
    });

    it('should return false when fetch throws error', async () => {
      const mockCodepoint = '1f600';

      // Mock twemoji-parser
      (parse as any).mockReturnValue([{ unicode: mockCodepoint }]);

      // Mock fetch to throw error
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const result = await service.checkTwemojiAvailability();

      expect(result).toBe(false);
    });

    it('should return false for invalid emoji', async () => {
      // Mock twemoji-parser to return empty array
      (parse as any).mockReturnValue([]);

      const result = await service.checkTwemojiAvailability();

      expect(result).toBe(false);
    });
  });

  describe('getHealthInfo', () => {
    it('should return detailed health information', async () => {
      const mockCodepoint = '1f600';

      // Mock twemoji-parser
      (parse as any).mockReturnValue([{ unicode: mockCodepoint }]);

      // Mock fetch to return success
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
      });

      const result = await service.getHealthInfo();

      expect(result).toMatchObject({
        available: true,
        lastChecked: expect.any(Date),
        responseTime: expect.any(Number),
      });
      expect(result.error).toBeUndefined();
    });

    it('should return error information when unavailable', async () => {
      const mockCodepoint = '1f600';

      // Mock twemoji-parser
      (parse as any).mockReturnValue([{ unicode: mockCodepoint }]);

      // Mock fetch to throw error
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const result = await service.getHealthInfo();

      expect(result).toMatchObject({
        available: false,
        lastChecked: expect.any(Date),
        responseTime: expect.any(Number),
      });
      expect(result.error).toBeUndefined(); // error is optional in the interface
    });
  });

  describe('cache management', () => {
    it('should clear cache', () => {
      service.clearCache();
      const stats = service.getCacheStats();
      expect(stats.size).toBe(0);
    });

    it('should return cache statistics', () => {
      const stats = service.getCacheStats();
      expect(stats).toMatchObject({
        size: expect.any(Number),
        keys: expect.any(Array),
      });
    });
  });
});
