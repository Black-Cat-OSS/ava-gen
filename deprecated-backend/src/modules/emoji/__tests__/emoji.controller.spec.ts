import { Test, TestingModule } from '@nestjs/testing';
import { EmojiController } from '../emoji.controller';
import { EmojiService } from '../emoji.service';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('EmojiController', () => {
  let controller: EmojiController;
  let service: EmojiService;

  const mockEmojiService = {
    getHealthInfo: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmojiController],
      providers: [
        {
          provide: EmojiService,
          useValue: mockEmojiService,
        },
      ],
    }).compile();

    controller = module.get<EmojiController>(EmojiController);
    // Don't get service from module, use the mock directly
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('healthCheck', () => {
    it('should return health information', async () => {
      const mockHealthInfo = {
        available: true,
        lastChecked: new Date(),
        responseTime: 150,
      };

      mockEmojiService.getHealthInfo.mockResolvedValue(mockHealthInfo);

      const result = await controller.healthCheck();

      expect(result).toBe(mockHealthInfo);
      expect(mockEmojiService.getHealthInfo).toHaveBeenCalledTimes(1);
    });

    it('should return error information when service is unavailable', async () => {
      const mockHealthInfo = {
        available: false,
        lastChecked: new Date(),
        responseTime: 5000,
        error: 'Network timeout',
      };

      mockEmojiService.getHealthInfo.mockResolvedValue(mockHealthInfo);

      const result = await controller.healthCheck();

      expect(result).toBe(mockHealthInfo);
      expect(mockEmojiService.getHealthInfo).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockEmojiService.getHealthInfo.mockRejectedValue(error);

      await expect(controller.healthCheck()).rejects.toThrow('Service error');
      expect(mockEmojiService.getHealthInfo).toHaveBeenCalledTimes(1);
    });
  });
});
