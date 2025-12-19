import { lazy, Suspense } from 'react';
import AvatarGalleryFeature from '@/features/avatar-gallery';
import AvatarWallpaper from '@/features/AvatarCircles';

const AvatarPreviewShowcase = lazy(() => import('@/features/avatar-preview-showcase'));

export const HomePage = () => {
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
