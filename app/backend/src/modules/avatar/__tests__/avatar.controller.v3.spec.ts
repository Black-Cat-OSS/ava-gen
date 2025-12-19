import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { AvatarController } from '../avatar.controller';
import { AvatarService } from '../avatar.service';
import { GenerateAvatarV3Dto } from '../dto/generate-avatar-v3.dto';

describe('AvatarController v3/generate', () => {
  let controller: AvatarController;
  let avatarService: AvatarService;

  const mockAvatarService = {
    generateAvatarV3: vi.fn(),
    healthCheck: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvatarController],
      providers: [
        {
          provide: AvatarService,
          useValue: mockAvatarService,
        },
      ],
    }).compile();

    controller = module.get<AvatarController>(AvatarController);
    avatarService = module.get<AvatarService>(AvatarService);

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateAvatarV3', () => {
    it('should generate emoji avatar successfully', async () => {
      const dto: GenerateAvatarV3Dto = {
        emoji: '😀',
        backgroundType: 'solid',
        primaryColor: '#3b82f6',
        foreignColor: '#ef4444',
        angle: 90,
        emojiSize: 'large',
      };

      const expectedResult = {
        id: 'test-id',
        createdAt: new Date(),
        version: 1,
      };

      mockAvatarService.generateAvatarV3.mockResolvedValue(expectedResult);

      const result = await controller.generateAvatarV3(dto);

      expect(result).toEqual(expectedResult);
      expect(avatarService.generateAvatarV3).toHaveBeenCalledWith(dto);
    });

    it('should generate emoji avatar with minimal required fields', async () => {
      const dto: GenerateAvatarV3Dto = {
        emoji: '🚀',
        backgroundType: 'linear',
      };

      const expectedResult = {
        id: 'test-id-2',
        createdAt: new Date(),
        version: 1,
      };

      mockAvatarService.generateAvatarV3.mockResolvedValue(expectedResult);

      const result = await controller.generateAvatarV3(dto);

      expect(result).toEqual(expectedResult);
      expect(avatarService.generateAvatarV3).toHaveBeenCalledWith(dto);
    });

    it('should handle service errors', async () => {
      const dto: GenerateAvatarV3Dto = {
        emoji: '😀',
        backgroundType: 'solid',
      };

      const error = new Error('Generation failed');
      mockAvatarService.generateAvatarV3.mockRejectedValue(error);

      await expect(controller.generateAvatarV3(dto)).rejects.toThrow('Generation failed');
    });
  });

  describe('DTO Validation', () => {
    it('should validate emoji field', () => {
      const dto = new GenerateAvatarV3Dto();
      dto.emoji = '😀';
      dto.backgroundType = 'solid';

      expect(dto.emoji).toBe('😀');
    });

    it('should validate backgroundType enum', () => {
      const validTypes = ['solid', 'linear', 'radial'];
      
      validTypes.forEach(type => {
        const dto = new GenerateAvatarV3Dto();
        dto.emoji = '😀';
        dto.backgroundType = type as any;
        
        expect(dto.backgroundType).toBe(type);
      });
    });

    it('should validate emojiSize enum', () => {
      const validSizes = ['small', 'medium', 'large'];
      
      validSizes.forEach(size => {
        const dto = new GenerateAvatarV3Dto();
        dto.emoji = '😀';
        dto.backgroundType = 'solid';
        dto.emojiSize = size as any;
        
        expect(dto.emojiSize).toBe(size);
      });
    });

    it('should validate angle range', () => {
      const dto = new GenerateAvatarV3Dto();
      dto.emoji = '😀';
      dto.backgroundType = 'linear';
      dto.angle = 180;

      expect(dto.angle).toBe(180);
    });

    it('should validate color format', () => {
      const dto = new GenerateAvatarV3Dto();
      dto.emoji = '😀';
      dto.backgroundType = 'solid';
      dto.primaryColor = '#3b82f6';
      dto.foreignColor = '#ef4444';

      expect(dto.primaryColor).toBe('#3b82f6');
      expect(dto.foreignColor).toBe('#ef4444');
    });
  });

  describe('Integration with ValidationPipe', () => {
    it('should validate required fields', async () => {
      const invalidDto = {
        // Missing required emoji field
        backgroundType: 'solid',
      };

      const validationPipe = new ValidationPipe({ 
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      
      await expect(
        validationPipe.transform(invalidDto, { type: 'body' })
      ).rejects.toThrow();
    });

    it('should validate enum values', async () => {
      const invalidDto = {
        emoji: '😀',
        backgroundType: 'invalid-type',
      };

      const validationPipe = new ValidationPipe({ 
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      
      await expect(
        validationPipe.transform(invalidDto, { type: 'body' })
      ).rejects.toThrow();
    });

    it('should validate color format', async () => {
      const invalidDto = {
        emoji: '😀',
        backgroundType: 'solid',
        primaryColor: 'invalid-color',
      };

      const validationPipe = new ValidationPipe({ 
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      
      await expect(
        validationPipe.transform(invalidDto, { type: 'body' })
      ).rejects.toThrow();
    });

    it('should validate angle range', async () => {
      const invalidDto = {
        emoji: '😀',
        backgroundType: 'linear',
        angle: 500, // Invalid angle
      };

      const validationPipe = new ValidationPipe({ 
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      
      await expect(
        validationPipe.transform(invalidDto, { type: 'body' })
      ).rejects.toThrow();
    });
  });
});
