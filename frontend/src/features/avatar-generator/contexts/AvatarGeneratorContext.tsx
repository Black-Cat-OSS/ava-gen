import { useState, type ReactNode } from 'react';
import { AvatarGeneratorContext } from './AvatarGeneratorContextDefinition';
import type { GenerateAvatarResponse } from '@/shared/api';

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
