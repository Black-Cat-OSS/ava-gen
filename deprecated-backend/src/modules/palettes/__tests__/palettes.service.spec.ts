import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { PalettesService } from '../palettes.service';
import { Palette } from '../palette.entity';
import { COLOR_PALETTES } from '../constants/color-schemes.constants';

describe('PalettesService', () => {
  let service: PalettesService;
  let paletteRepository: Repository<Palette>;
  let mockPaletteRepository: any;

  const mockPalette: Palette = {
    id: 'test-id',
    name: 'Test Palette',
    key: 'test-palette',
    primaryColor: '#3B82F6',
    foreignColor: '#EF4444',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    mockPaletteRepository = {
      find: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
      count: vi.fn(),
      remove: vi.fn(),
      upsert: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PalettesService,
        {
          provide: getRepositoryToken(Palette),
          useValue: mockPaletteRepository,
        },
      ],
    }).compile();

    service = module.get<PalettesService>(PalettesService);
    paletteRepository = module.get<Repository<Palette>>(
      getRepositoryToken(Palette),
    );
  });

  describe('getAllPalettes', () => {
    it('should return all palettes from database', async () => {
      const mockPalettes = [mockPalette];
      mockPaletteRepository.find.mockResolvedValue(mockPalettes);

      const result = await service.getAllPalettes();

      expect(result).toEqual(mockPalettes);
      expect(mockPaletteRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'ASC' },
      });
    });

    it('should return empty array when no palettes exist', async () => {
      mockPaletteRepository.find.mockResolvedValue([]);

      const result = await service.getAllPalettes();

      expect(result).toEqual([]);
    });
  });

  describe('getPaletteByKey', () => {
    it('should return palette by key', async () => {
      mockPaletteRepository.findOne.mockResolvedValue(mockPalette);

      const result = await service.getPaletteByKey('test-palette');

      expect(result).toEqual(mockPalette);
      expect(mockPaletteRepository.findOne).toHaveBeenCalledWith({
        where: { key: 'test-palette' },
      });
    });

    it('should return null when palette not found', async () => {
      mockPaletteRepository.findOne.mockResolvedValue(null);

      const result = await service.getPaletteByKey('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('seedPalettes', () => {
    it('should seed palettes if database is empty', async () => {
      mockPaletteRepository.count.mockResolvedValue(0);
      mockPaletteRepository.save.mockResolvedValue([mockPalette]);

      await service.seedPalettes();

      expect(mockPaletteRepository.count).toHaveBeenCalled();
      expect(mockPaletteRepository.save).toHaveBeenCalled();
    });

    it('should not seed palettes if they already exist', async () => {
      mockPaletteRepository.count.mockResolvedValue(5);

      await service.seedPalettes();

      expect(mockPaletteRepository.count).toHaveBeenCalled();
      expect(mockPaletteRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getColorSchemes', () => {
    it('should return palettes in ColorScheme format', async () => {
      const mockPalettes = [mockPalette];
      mockPaletteRepository.find.mockResolvedValue(mockPalettes);

      const result = await service.getColorSchemes();

      expect(result).toEqual([
        {
          name: 'test-palette',
          primaryColor: '#3B82F6',
          foreignColor: '#EF4444',
        },
      ]);
    });

    it('should validate hex format of colors', async () => {
      const mockPalettes = [
        {
          ...mockPalette,
          primaryColor: '#3B82F6',
          foreignColor: '#EF4444',
        },
      ];
      mockPaletteRepository.find.mockResolvedValue(mockPalettes);

      const result = await service.getColorSchemes();

      expect(result[0].primaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(result[0].foreignColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  describe('generateRandomPalette', () => {
    it('should generate a random palette with valid hex colors', () => {
      const result = service.generateRandomPalette();

      expect(result.primaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(result.foreignColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(result.primaryColor).not.toBe(result.foreignColor);
    });

    it('should generate complementary palette with type "complementary"', () => {
      const result = service.generateRandomPalette('complementary');

      expect(result.primaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(result.foreignColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should generate analogous palette with type "analogous"', () => {
      const result = service.generateRandomPalette('analogous');

      expect(result.primaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(result.foreignColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should generate monochromatic palette with type "monochromatic"', () => {
      const result = service.generateRandomPalette('monochromatic');

      expect(result.primaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(result.foreignColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should generate split-complementary palette with type "split-complementary"', () => {
      const result = service.generateRandomPalette('split-complementary');

      expect(result.primaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(result.foreignColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  describe('createPalette', () => {
    it('should create a new palette', async () => {
      const newPalette = {
        name: 'New Palette',
        key: 'new-palette',
        primaryColor: '#3B82F6',
        foreignColor: '#EF4444',
      };

      mockPaletteRepository.create.mockReturnValue(newPalette);
      mockPaletteRepository.save.mockResolvedValue(newPalette);

      const result = await service.createPalette(
        newPalette.name,
        newPalette.key,
        newPalette.primaryColor,
        newPalette.foreignColor,
      );

      expect(result).toEqual(newPalette);
      expect(mockPaletteRepository.create).toHaveBeenCalledWith(newPalette);
      expect(mockPaletteRepository.save).toHaveBeenCalled();
    });
  });

  describe('updatePalette', () => {
    it('should update an existing palette', async () => {
      const updatedData = {
        name: 'Updated Palette',
        primaryColor: '#00FF00',
        foreignColor: '#FF00FF',
      };

      mockPaletteRepository.findOne.mockResolvedValue(mockPalette);
      mockPaletteRepository.save.mockResolvedValue({
        ...mockPalette,
        ...updatedData,
      });

      const result = await service.updatePalette('test-id', updatedData);

      expect(result.name).toBe(updatedData.name);
      expect(mockPaletteRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(mockPaletteRepository.save).toHaveBeenCalled();
    });

    it('should throw error if palette not found', async () => {
      mockPaletteRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updatePalette('non-existent', {}),
      ).rejects.toThrow();
    });
  });

  describe('deletePalette', () => {
    it('should delete a palette', async () => {
      mockPaletteRepository.findOne.mockResolvedValue(mockPalette);
      mockPaletteRepository.remove.mockResolvedValue(mockPalette);

      await service.deletePalette('test-id');

      expect(mockPaletteRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(mockPaletteRepository.remove).toHaveBeenCalled();
    });

    it('should throw error if palette not found', async () => {
      mockPaletteRepository.findOne.mockResolvedValue(null);

      await expect(service.deletePalette('non-existent')).rejects.toThrow();
    });
  });
});
