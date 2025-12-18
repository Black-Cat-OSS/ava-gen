import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { FailImage } from '@/shared';
import type { Avatar } from '@/entities';
import { getImageUrl } from '@/shared/lib/utils';

interface AvatarCardProps {
  avatar: Avatar;
  showDetails?: boolean;
  imageSize?: number;
  imageFilter?: string;
  className?: string;
}

export const AvatarCard = ({ avatar, showDetails = true, className = '' }: AvatarCardProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={`rounded-lg p-4 bg-gray-700 dark:bg-gray-700 hover:shadow-lg transition-shadow ${className}`}
    >
      <div className="aspect-square bg-muted rounded-md mb-3 overflow-hidden">
        <img
          src={getImageUrl(avatar.id, { size: 7 })}
          alt={avatar.name}
          className="w-full h-full object-cover"
          onError={() => <FailImage />}
        />
      </div>

      {showDetails && (
        <div className="space-y-1">
          <Link
            to="/avatar-viewer"
            search={{ id: avatar.id, size: undefined, filter: undefined }}
            className="text-xs font-medium truncate text-blue-500 hover:text-blue-500/50"
            title={avatar.id}
          >
            {t('pages.home.avatarId')}: {avatar.id.slice(0, 8)}...
          </Link>
          <p className="text-xs text-gray-400">{new Date(avatar.createdAt).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
};
