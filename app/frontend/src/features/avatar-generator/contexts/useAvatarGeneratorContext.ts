import { useContext } from 'react';
import { AvatarGeneratorContext } from './AvatarGeneratorContext';

export const useAvatarGeneratorContext = () => useContext(AvatarGeneratorContext);
