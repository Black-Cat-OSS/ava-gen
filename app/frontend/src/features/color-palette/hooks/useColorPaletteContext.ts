import { useContext } from 'react';
import { ColorPaletteContext } from '../contexts';

/**
 * Hook to use the color palette context
 * @throws Error if used outside of ColorPaletteProvider
 */
export const useColorPaletteContext = () => {
  const context = useContext(ColorPaletteContext);
  if (!context) {
    throw new Error('useColorPaletteContext must be used within a ColorPaletteProvider');
  }
  return context;
};
