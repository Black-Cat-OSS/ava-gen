import { useState, type ReactNode } from 'react';
import { AvatarGeneratorContext } from './AvatarGeneratorContextDefinition';

interface AvatarGeneratorProviderProps {
  children: ReactNode;
}

export const AvatarGeneratorProvider = ({ children }: AvatarGeneratorProviderProps) => {
  const [generatedAvatar, setGeneratedAvatar] = useState(null);

  return (
    <AvatarGeneratorContext.Provider value={{ generatedAvatar, setGeneratedAvatar }}>
      {children}
    </AvatarGeneratorContext.Provider>
  );
};
