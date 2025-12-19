import { describe, it, expect } from 'vitest';
import {
  convertNamedColorToHex,
  isValidHexColor,
  convertAllColorsToHex,
} from '../color-converter.util';

describe('ColorConverter', () => {
  describe('convertNamedColorToHex', () => {
    it('should convert green to hex', () => {
      expect(convertNamedColorToHex('green')).toBe('#22C55E');
    });

    it('should convert blue to hex', () => {
      expect(convertNamedColorToHex('blue')).toBe('#3B82F6');
    });

    it('should convert red to hex', () => {
      expect(convertNamedColorToHex('red')).toBe('#EF4444');
    });

    it('should return hex color as-is if already hex', () => {
      expect(convertNamedColorToHex('#3B82F6')).toBe('#3B82F6');
    });

    it('should handle case insensitive color names', () => {
      expect(convertNamedColorToHex('GREEN')).toBe('#22C55E');
      expect(convertNamedColorToHex('Green')).toBe('#22C55E');
    });

    it('should return default color for unknown color name', () => {
      expect(convertNamedColorToHex('unknown')).toBe('#3B82F6');
    });
  });

  describe('isValidHexColor', () => {
    it('should return true for valid hex colors', () => {
      expect(isValidHexColor('#3B82F6')).toBe(true);
      expect(isValidHexColor('#000000')).toBe(true);
      expect(isValidHexColor('#FFFFFF')).toBe(true);
      expect(isValidHexColor('#abc123')).toBe(true);
    });

    it('should return false for invalid hex colors', () => {
      expect(isValidHexColor('3B82F6')).toBe(false);
      expect(isValidHexColor('#GGG')).toBe(false);
      expect(isValidHexColor('#AB')).toBe(false);
      expect(isValidHexColor('')).toBe(false);
      expect(isValidHexColor('green')).toBe(false);
    });
  });

  describe('convertAllColorsToHex', () => {
    it('should convert all named colors in a scheme to hex', () => {
      const input = {
        name: 'test',
        primaryColor: 'green',
        foreignColor: 'blue',
      };

      const result = convertAllColorsToHex(input);

      expect(result).toEqual({
        name: 'test',
        primaryColor: '#22C55E',
        foreignColor: '#3B82F6',
      });
    });

    it('should leave hex colors unchanged', () => {
      const input = {
        name: 'test',
        primaryColor: '#FF5733',
        foreignColor: '#33FF57',
      };

      const result = convertAllColorsToHex(input);

      expect(result).toEqual(input);
    });

    it('should handle mixed named and hex colors', () => {
      const input = {
        name: 'test',
        primaryColor: 'green',
        foreignColor: '#3B82F6',
      };

      const result = convertAllColorsToHex(input);

      expect(result).toEqual({
        name: 'test',
        primaryColor: '#22C55E',
        foreignColor: '#3B82F6',
      });
    });
  });
});
