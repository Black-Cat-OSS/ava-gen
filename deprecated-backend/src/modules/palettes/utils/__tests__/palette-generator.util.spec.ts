import { describe, it, expect } from 'vitest';
import {
  generateComplementaryPalette,
  generateAnalogousPalette,
  generateMonochromaticPalette,
  generateSplitComplementaryPalette,
  generateRandomPalette,
  calculateContrast,
} from '../palette-generator.util';

describe('PaletteGenerator', () => {
  describe('generateComplementaryPalette', () => {
    it('should generate valid hex colors', () => {
      const palette = generateComplementaryPalette();

      expect(palette.primaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(palette.foreignColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should generate colors that are 180 degrees apart', () => {
      const palette = generateComplementaryPalette();

      expect(palette.primaryColor).not.toBe(palette.foreignColor);
    });
  });

  describe('generateAnalogousPalette', () => {
    it('should generate valid hex colors', () => {
      const palette = generateAnalogousPalette();

      expect(palette.primaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(palette.foreignColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should generate harmonious colors', () => {
      const palette = generateAnalogousPalette();

      expect(palette.primaryColor).not.toBe(palette.foreignColor);
    });
  });

  describe('generateMonochromaticPalette', () => {
    it('should generate valid hex colors', () => {
      const palette = generateMonochromaticPalette();

      expect(palette.primaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(palette.foreignColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should generate different shades of the same hue', () => {
      const palette = generateMonochromaticPalette();

      expect(palette.primaryColor).not.toBe(palette.foreignColor);
    });
  });

  describe('generateSplitComplementaryPalette', () => {
    it('should generate valid hex colors', () => {
      const palette = generateSplitComplementaryPalette();

      expect(palette.primaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(palette.foreignColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should generate colors with balanced contrast', () => {
      const palette = generateSplitComplementaryPalette();

      expect(palette.primaryColor).not.toBe(palette.foreignColor);
    });
  });

  describe('generateRandomPalette', () => {
    it('should generate valid hex colors without type', () => {
      const palette = generateRandomPalette();

      expect(palette.primaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(palette.foreignColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should generate complementary palette with type "complementary"', () => {
      const palette = generateRandomPalette('complementary');

      expect(palette.primaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(palette.foreignColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should generate analogous palette with type "analogous"', () => {
      const palette = generateRandomPalette('analogous');

      expect(palette.primaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(palette.foreignColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should generate monochromatic palette with type "monochromatic"', () => {
      const palette = generateRandomPalette('monochromatic');

      expect(palette.primaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(palette.foreignColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should generate split-complementary palette with type "split-complementary"', () => {
      const palette = generateRandomPalette('split-complementary');

      expect(palette.primaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(palette.foreignColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  describe('calculateContrast', () => {
    it('should calculate contrast ratio between white and black', () => {
      const contrast = calculateContrast('#FFFFFF', '#000000');

      expect(contrast).toBeGreaterThan(20);
      expect(contrast).toBeLessThan(22);
    });

    it('should calculate contrast ratio between similar colors', () => {
      const contrast = calculateContrast('#FFFFFF', '#F0F0F0');

      expect(contrast).toBeGreaterThan(1);
      expect(contrast).toBeLessThan(2);
    });

    it('should return 1 for identical colors', () => {
      const contrast = calculateContrast('#3B82F6', '#3B82F6');

      expect(contrast).toBe(1);
    });
  });

  describe('WCAG compliance', () => {
    it('should generate palettes with sufficient contrast for text', () => {
      const palette = generateComplementaryPalette();
      const contrast = calculateContrast(palette.primaryColor, palette.foreignColor);

      expect(contrast).toBeGreaterThanOrEqual(3);
    });

    it('should generate palettes that meet AA standard minimum contrast', () => {
      const palette = generateAnalogousPalette();
      const contrast = calculateContrast(palette.primaryColor, palette.foreignColor);

      expect(contrast).toBeGreaterThanOrEqual(1);
    });
  });
});
