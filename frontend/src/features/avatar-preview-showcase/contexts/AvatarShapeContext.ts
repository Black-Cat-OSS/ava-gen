import { createContext } from 'react';
import type { AvatarShapeContextValue } from './types';

/**
 * Context for managing avatar shape state
 */
export const AvatarShapeContext = createContext<AvatarShapeContextValue | undefined>(undefined);
