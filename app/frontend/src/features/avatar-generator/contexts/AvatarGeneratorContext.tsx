import { createContext } from 'react';
import type { GenerateAvatarResponse } from '@/shared/api';

interface AvatarGeneratorContextType {
  generatedAvatar: GenerateAvatarResponse | null;
  setGeneratedAvatar: (avatar: GenerateAvatarResponse | null) => void;
}

export const AvatarGeneratorContext = createContext<AvatarGeneratorContextType>({
  generatedAvatar: null,
  setGeneratedAvatar: () => {},
});
