import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { AvatarService } from '../avatar.service';
import { GeneratorService } from '../modules/generator/generator.service';
import { StorageService } from '../modules/storage/storage.service';
import { AvatarRepository } from '../avatar.repository';
import { GenerateAvatarV3Dto } from '../dto/generate-avatar-v3.dto';

describe('AvatarService generateAvatarV3', () => {
  let service: AvatarService;
  let generatorService: GeneratorService;
  let storageService: StorageService;
  let avatarRepository: AvatarRepository;

  const mockGeneratorService = {
    generateEmojiAvatar: vi.fn(),
    checkTwemojiAvailability: vi.fn(),
  };

  const mockStorageService = {
    saveAvatar: vi.fn(),
  };

  const mockAvatarRepository = {
    create: vi.fn(),
    save: vi.fn(),
    count: vi.fn(),
  };

  const mockLogger = {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvatarService,
        {
          provide: GeneratorService,
          useValue: mockGeneratorService,
        },
        {
          provide: StorageService,
          useValue: mockStorageService,
        },
        {
          provide: AvatarRepository,
          useValue: mockAvatarRepository,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<AvatarService>(AvatarService);
    generatorService = module.get<GeneratorService>(GeneratorService);
    storageService = module.get<StorageService>(StorageService);
    avatarRepository = module.get<AvatarRepository>(AvatarRepository);

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

      const mockAvatarObject = {
        meta_data_name: 'test-avatar-id',
        meta_data_created_at: new Date(),
        meta_data_payload: {
          emoji: '😀',
          backgroundType: 'solid',
          emojiSize: 'large',
        },
        image_4n: Buffer.from('image-data-4n'),
        image_5n: Buffer.from('image-data-5n'),
        image_6n: Buffer.from('image-data-6n'),
        image_7n: Buffer.from('image-data-7n'),
        image_8n: Buffer.from('image-data-8n'),
        image_9n: Buffer.from('image-data-9n'),
      };

      const mockSavedAvatar = {
        id: 'test-avatar-id',
        name: 'test-avatar-id',
        filePath: '/path/to/avatar',
        primaryColor: '#3b82f6',
        foreignColor: '#ef4444',
        colorScheme: undefined,
        seed: undefined,
        generatorType: 'emoji',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
      };

      mockGeneratorService.generateEmojiAvatar.mockResolvedValue(mockAvatarObject);
      mockStorageService.saveAvatar.mockResolvedValue('/path/to/avatar');
      mockAvatarRepository.create.mockReturnValue(mockSavedAvatar);
      mockAvatarRepository.save.mockResolvedValue(mockSavedAvatar);

      const result = await service.generateAvatarV3(dto);

      expect(result).toEqual({
        id: 'test-avatar-id',
        createdAt: mockSavedAvatar.createdAt,
        version: 1,
      });

      expect(mockGeneratorService.generateEmojiAvatar).toHaveBeenCalledWith(
        '😀',
        'solid',
        '#3b82f6',
        '#ef4444',
        undefined, // colorScheme
        90, // angle
        'large' // emojiSize
      );

      expect(mockStorageService.saveAvatar).toHaveBeenCalledWith(mockAvatarObject);
      expect(mockAvatarRepository.create).toHaveBeenCalledWith({
        id: 'test-avatar-id',
        name: 'test-avatar-id',
        filePath: '/path/to/avatar',
        primaryColor: '#3b82f6',
        foreignColor: '#ef4444',
        colorScheme: undefined,
        seed: undefined,
        generatorType: 'emoji',
      });
      expect(mockAvatarRepository.save).toHaveBeenCalledWith(mockSavedAvatar);
    });

    it('should generate emoji avatar with linear background and angle', async () => {
      const dto: GenerateAvatarV3Dto = {
        emoji: '🚀',
        backgroundType: 'linear',
        primaryColor: '#ff6b6b',
        foreignColor: '#4ecdc4',
        angle: 45,
        emojiSize: 'medium',
      };

      const mockAvatarObject = {
        meta_data_name: 'test-avatar-id-2',
        meta_data_created_at: new Date(),
        meta_data_payload: {
          emoji: '🚀',
          backgroundType: 'linear',
          emojiSize: 'medium',
          angle: 45,
        },
        image_4n: Buffer.from('image-data-4n'),
        image_5n: Buffer.from('image-data-5n'),
        image_6n: Buffer.from('image-data-6n'),
        image_7n: Buffer.from('image-data-7n'),
        image_8n: Buffer.from('image-data-8n'),
        image_9n: Buffer.from('image-data-9n'),
      };

      const mockSavedAvatar = {
        id: 'test-avatar-id-2',
        name: 'test-avatar-id-2',
        filePath: '/path/to/avatar-2',
        primaryColor: '#ff6b6b',
        foreignColor: '#4ecdc4',
        colorScheme: undefined,
        seed: undefined,
        generatorType: 'emoji',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
      };

      mockGeneratorService.generateEmojiAvatar.mockResolvedValue(mockAvatarObject);
      mockStorageService.saveAvatar.mockResolvedValue('/path/to/avatar-2');
      mockAvatarRepository.create.mockReturnValue(mockSavedAvatar);
      mockAvatarRepository.save.mockResolvedValue(mockSavedAvatar);

      const result = await service.generateAvatarV3(dto);

      expect(result).toEqual({
        id: 'test-avatar-id-2',
        createdAt: mockSavedAvatar.createdAt,
        version: 1,
      });

      expect(mockGeneratorService.generateEmojiAvatar).toHaveBeenCalledWith(
        '🚀',
        'linear',
        '#ff6b6b',
        '#4ecdc4',
        undefined, // colorScheme
        45, // angle
        'medium' // emojiSize
      );
    });

    it('should handle generation errors', async () => {
      const dto: GenerateAvatarV3Dto = {
        emoji: '😀',
        backgroundType: 'solid',
      };

      const error = new Error('Emoji generation failed');
      mockGeneratorService.generateEmojiAvatar.mockRejectedValue(error);

      await expect(service.generateAvatarV3(dto)).rejects.toThrow('Emoji generation failed');
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to generate emoji avatar: Emoji generation failed',
        error
      );
    });

    it('should handle storage errors', async () => {
      const dto: GenerateAvatarV3Dto = {
        emoji: '😀',
        backgroundType: 'solid',
      };

      const mockAvatarObject = {
        meta_data_name: 'test-avatar-id',
        meta_data_created_at: new Date(),
        meta_data_payload: {
          emoji: '😀',
          backgroundType: 'solid',
          emojiSize: 'large',
        },
        image_4n: Buffer.from('image-data-4n'),
        image_5n: Buffer.from('image-data-5n'),
        image_6n: Buffer.from('image-data-6n'),
        image_7n: Buffer.from('image-data-7n'),
        image_8n: Buffer.from('image-data-8n'),
        image_9n: Buffer.from('image-data-9n'),
      };

      const storageError = new Error('Storage failed');
      mockGeneratorService.generateEmojiAvatar.mockResolvedValue(mockAvatarObject);
      mockStorageService.saveAvatar.mockRejectedValue(storageError);

      await expect(service.generateAvatarV3(dto)).rejects.toThrow('Storage failed');
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to generate emoji avatar: Storage failed',
        storageError
      );
    });

    it('should handle database errors', async () => {
      const dto: GenerateAvatarV3Dto = {
        emoji: '😀',
        backgroundType: 'solid',
      };

      const mockAvatarObject = {
        meta_data_name: 'test-avatar-id',
        meta_data_created_at: new Date(),
        meta_data_payload: {
          emoji: '😀',
          backgroundType: 'solid',
          emojiSize: 'large',
        },
        image_4n: Buffer.from('image-data-4n'),
        image_5n: Buffer.from('image-data-5n'),
        image_6n: Buffer.from('image-data-6n'),
        image_7n: Buffer.from('image-data-7n'),
        image_8n: Buffer.from('image-data-8n'),
        image_9n: Buffer.from('image-data-9n'),
      };

      const dbError = new Error('Database error');
      mockGeneratorService.generateEmojiAvatar.mockResolvedValue(mockAvatarObject);
      mockStorageService.saveAvatar.mockResolvedValue('/path/to/avatar');
      mockAvatarRepository.create.mockReturnValue({});
      mockAvatarRepository.save.mockRejectedValue(dbError);

      await expect(service.generateAvatarV3(dto)).rejects.toThrow('Database error');
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to generate emoji avatar: Database error',
        dbError
      );
    });
  });

  describe('healthCheck with Twemoji', () => {
    it('should return healthy status when Twemoji is available', async () => {
      mockAvatarRepository.count.mockResolvedValue(42);
      mockGeneratorService.checkTwemojiAvailability.mockResolvedValue(true);

      const result = await service.healthCheck();

      expect(result).toEqual({
        database: 42,
        status: 'healthy',
        services: {
          twemoji: {
            available: true,
            lastChecked: expect.any(Date),
          },
        },
      });
    });

    it('should return unhealthy status when Twemoji is unavailable', async () => {
      mockAvatarRepository.count.mockResolvedValue(42);
      mockGeneratorService.checkTwemojiAvailability.mockResolvedValue(false);

      const result = await service.healthCheck();

      expect(result).toEqual({
        database: 42,
        status: 'unhealthy',
        services: {
          twemoji: {
            available: false,
            lastChecked: expect.any(Date),
          },
        },
      });

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Twemoji CDN is not available - emoji avatar generation may fail'
      );
    });

    it('should handle Twemoji check errors', async () => {
      mockAvatarRepository.count.mockResolvedValue(42);
      mockGeneratorService.checkTwemojiAvailability.mockRejectedValue(new Error('Network error'));

      const result = await service.healthCheck();

      expect(result).toEqual({
        database: 42,
        status: 'unhealthy',
        services: {
          twemoji: {
            available: false,
            lastChecked: expect.any(Date),
          },
        },
      });

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Twemoji CDN is not available - emoji avatar generation may fail'
      );
    });
  });
});
