import { useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useColorPalettes } from '@/shared/lib';
import type { ColorPalette } from '../types';
import { ColorPaletteContext } from '../contexts/ColorPaletteContextDefinition';
import type { ColorPaletteContextValue } from '../contexts/ColorPaletteContextDefinition';

/**
 * Props for the ColorPaletteProvider component
 */
interface ColorPaletteProviderProps {
  children: ReactNode;
  /** Initial selected scheme */
  initialScheme?: string;
  /** Callback when palette changes (for external state management) */
  onPaletteChange?: (paletteKey: string, palette?: ColorPalette) => void;
}

/**
 * Provider component for color palette context
 * Manages color palette state and provides it to child components
 * Uses regular useQuery for non-Suspense scenarios
 */
export const ColorPaletteProvider = ({ 
  children, 
  initialScheme = 'default',
  onPaletteChange: externalOnPaletteChange 
}: ColorPaletteProviderProps) => {
  const colorPalettesQuery = useColorPalettes();
  const { t } = useTranslation();

  // Internal state for selected scheme
  const [selectedScheme, setSelectedScheme] = useState(initialScheme);

  // Generate color schemes from API data
  const colorSchemes = colorPalettesQuery.data?.palettes?.map(palette => ({
    value: palette.key,
    label: t(`features.avatarGenerator.colorSchemes.${palette.key}`) || palette.name,
  })) || [];

  /**
   * Handle palette change
   */
  const handlePaletteChange = (paletteKey: string) => {
    setSelectedScheme(paletteKey);
    
    // Call external callback if provided
    if (externalOnPaletteChange) {
      const palette = colorPalettesQuery.data?.palettes?.find(p => p.key === paletteKey);
      externalOnPaletteChange(paletteKey, palette);
    }
  };

  /**
   * Handle random palette selection
   */
  const handleRandomPalette = () => {
    if (!colorPalettesQuery.data?.palettes) return;
    
    const availablePalettes = colorPalettesQuery.data.palettes.filter(p => p.key !== 'default');
    const randomPalette = availablePalettes[Math.floor(Math.random() * availablePalettes.length)];
    
    handlePaletteChange(randomPalette.key);
  };

  const contextValue: ColorPaletteContextValue = {
    selectedScheme,
    colorSchemes,
    palettes: colorPalettesQuery.data?.palettes,
    isLoading: colorPalettesQuery.isLoading,
    isError: colorPalettesQuery.isError,
    onPaletteChange: handlePaletteChange,
    onRandomPalette: handleRandomPalette,
    setSelectedScheme,
  };

  return (
    <ColorPaletteContext.Provider value={contextValue}>
      {children}
    </ColorPaletteContext.Provider>
  );
};
