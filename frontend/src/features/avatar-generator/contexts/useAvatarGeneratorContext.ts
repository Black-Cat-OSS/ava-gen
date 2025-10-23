import { useContext } from 'react';
import { AvatarGeneratorContext } from './AvatarGeneratorContextDefinition';

export const useAvatarGeneratorContext = () => {
  const context = useContext(AvatarGeneratorContext);
  if (context === undefined) {
    throw new Error('useAvatarGeneratorContext must be used within an AvatarGeneratorProvider');
  }
  return context;
};
