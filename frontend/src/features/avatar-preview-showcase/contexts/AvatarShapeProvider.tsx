import { useState, type ReactNode } from 'react';
import { AvatarShapeContext } from './AvatarShapeContext';
import type { AvatarShape, AvatarShapeContextValue } from './types';

/**
 * Props for AvatarShapeProvider
 */
interface AvatarShapeProviderProps {
  children: ReactNode;
}

/**
 * Provider component for avatar shape context
 * Manages the state of avatar display shape (circle or square)
 */
export const AvatarShapeProvider: React.FC<AvatarShapeProviderProps> = ({ children }) => {
  const [shape, setShape] = useState<AvatarShape>('circle');

  const value: AvatarShapeContextValue = {
    shape,
    setShape,
  };

  return (
    <AvatarShapeContext.Provider value={value}>
      {children}
    </AvatarShapeContext.Provider>
  );
};

