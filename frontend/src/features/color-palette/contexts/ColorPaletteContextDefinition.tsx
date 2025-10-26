import { createContext } from 'react';
import type { ColorPalette, ColorScheme } from '../types/types';

/**
 * Interface for the color palette context value
 */
export interface ColorPaletteContextValue {
  /** Currently selected color scheme */
  selectedScheme: string;
  /** Available color schemes from API */
  colorSchemes: ColorScheme[];
  /** Color palettes data from API */
  palettes: ColorPalette[] | undefined;
  /** Loading state of color palettes */
  isLoading: boolean;
  /** Error state of color palettes */
  isError: boolean;
  /** Whether there are more pages to load */
  hasNextPage: boolean;
  /** Whether next page is currently being fetched */
  isFetchingNextPage: boolean;
  /** Callback when palette is changed */
  onPaletteChange: (paletteKey: string) => void;
  /** Callback when random palette button is clicked */
  onRandomPalette: () => void;
  /** Callback to load next page */
  loadMore: () => void;
  /** Set the selected scheme (for external control) */
  setSelectedScheme: (scheme: string) => void;
}

/**
 * Context for managing color palette state
 */
export const ColorPaletteContext = createContext<ColorPaletteContextValue | undefined>(undefined);
