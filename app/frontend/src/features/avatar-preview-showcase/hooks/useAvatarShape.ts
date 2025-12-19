import { useContext } from 'react';
import { AvatarShapeContext } from '../contexts';
import type { AvatarShapeContextValue } from '../contexts/types';

/**
 * Hook to use avatar shape context
 * @returns Avatar shape context value
 * @throws Error if used outside of AvatarShapeProvider
 */
export const useAvatarShape = (): AvatarShapeContextValue => {
  const context = useContext(AvatarShapeContext);
  
  if (context === undefined) {
    throw new Error('useAvatarShape must be used within an AvatarShapeProvider');
  }
  
  return context;
};
