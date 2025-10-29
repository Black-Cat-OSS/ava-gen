import { lazy, Suspense } from 'react';
import AvatarGalleryFeature from '@/features/avatar-gallery';

export const HomePage = () => {
  const AvatarPreviewShowcase = lazy(() => import('@/features/avatar-preview-showcase'));
  const AvatarWallpaper = lazy(() => import('@/features/AvatarCircles'));

  return (
    <div className="py-8">
      <div className="max-w">
        <AvatarWallpaper />

        <AvatarGalleryFeature />

        <Suspense fallback={<div>Loading...</div>}>
          <AvatarPreviewShowcase />
        </Suspense>
      </div>
    </div>
  );
};
