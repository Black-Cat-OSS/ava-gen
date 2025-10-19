import { useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useColorPalettesSuspense } from '@/shared/lib';
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
 * Suspense-compatible provider component for color palette context
 * Uses useSuspenseQuery instead of useQuery for better Suspense integration
 * Throws promise during loading, allowing Suspense boundary to handle loading state
 */
export const ColorPaletteProviderSuspense = ({ 
  children, 
  initialScheme = 'default',
  onPaletteChange: externalOnPaletteChange 
}: ColorPaletteProviderProps) => {
  const colorPalettesQuery = useColorPalettesSuspense();
  const { t } = useTranslation();

  // Internal state for selected scheme
  const [selectedScheme, setSelectedScheme] = useState(initialScheme);

  // Generate color schemes from API data
  const colorSchemes = colorPalettesQuery.data?.map(palette => ({
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
      const palette = colorPalettesQuery.data?.find(p => p.key === paletteKey);
      externalOnPaletteChange(paletteKey, palette);
    }
  };

  /**
   * Handle random palette selection
   */
  const handleRandomPalette = () => {
    if (!colorPalettesQuery.data) return;
    
    const availablePalettes = colorPalettesQuery.data.filter(p => p.key !== 'default');
    const randomPalette = availablePalettes[Math.floor(Math.random() * availablePalettes.length)];
    
    handlePaletteChange(randomPalette.key);
  };

  const contextValue: ColorPaletteContextValue = {
    selectedScheme,
    colorSchemes,
    palettes: colorPalettesQuery.data,
    isLoading: false, // With Suspense, loading is handled by Suspense boundary
    isError: false,   // With Suspense, errors are handled by Error Boundary
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
