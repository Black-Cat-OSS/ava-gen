import { lazy, Suspense } from 'react';
import type { Avatar } from '@/entities';
import { AvatarCardSkeleton } from './AvatarCardSkeleton';

const AvatarCard = lazy(() => import('@/widgets').then(module => ({ default: module.AvatarCard })));

interface AvatarCardListProps {
  avatars: Avatar[];
}

export const AvatarCardList = ({ avatars }: AvatarCardListProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {avatars.map(avatar => (
        <Suspense key={avatar.id} fallback={<AvatarCardSkeleton />}>
          <AvatarCard avatar={avatar} />
        </Suspense>
      ))}
    </div>
  );
};
