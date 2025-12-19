import { AvatarCardSkeleton } from './AvatarCardSkeleton';

export const AvatarGallerySkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, index) => (
        <AvatarCardSkeleton key={index} />
      ))}
    </div>
  );
};
