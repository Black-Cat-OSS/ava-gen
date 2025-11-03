import { useState, type ReactNode } from 'react';
import type { GenerateAvatarResponse } from '@/shared/api';
import { AvatarGeneratorContext } from '../contexts/AvatarGeneratorContext';

interface AvatarGeneratorProviderProps {
  children: ReactNode;
}

export const AvatarGeneratorProvider = ({ children }: AvatarGeneratorProviderProps) => {
  const [generatedAvatar, setGeneratedAvatar] = useState<GenerateAvatarResponse | null>(null);

  return (
    <AvatarGeneratorContext.Provider value={{ generatedAvatar, setGeneratedAvatar }}>
      {children}
    </AvatarGeneratorContext.Provider>
  );
};
