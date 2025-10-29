import { useContext } from 'react';
import { AvatarGalleryContext } from '../ui/AvatarGalleryContext';

export const useAvatarGallery = () => {
  const context = useContext(AvatarGalleryContext);
  if (context === undefined) {
    throw new Error('useAvatarGallery must be used within an AvatarGalleryProvider');
  }
  return context;
};
