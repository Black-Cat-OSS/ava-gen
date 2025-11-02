import { FailImage, useAvatarsSuspense } from '@/shared';
import { getImageUrl } from '@/shared/lib/utils';

export const AvatarCircles = () => {
  const { data } = useAvatarsSuspense({ pick: 5, offset: 0 });

  return (
    <div className="flex items-center">
      {data?.items.map((avatar, index) => (
        <div
          key={avatar.id}
          className="w-40 h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-full border-4 border-background shadow-lg overflow-hidden transition-transform hover:scale-110"
          style={{
            marginLeft: index > 0 ? '-75px' : 0,
            zIndex: data?.items.length - index,
          }}
        >
          <img
            src={getImageUrl(avatar.id, { size: 7 })}
            loading="lazy"
            fetchPriority="low"
            alt={avatar.name}
            className="w-full h-full object-cover"
            onError={() => <FailImage />}
          />
        </div>
      ))}
    </div>
  );
};
