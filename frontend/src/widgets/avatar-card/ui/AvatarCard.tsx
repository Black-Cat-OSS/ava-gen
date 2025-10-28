import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { AvatarApi } from '@/shared/api';
import { useEffect, useState } from 'react';
import type { Avatar } from '@/entities';
import { FailImage } from '@/shared';

interface AvatarCardProps {
  avatar: {
    id: string;
    name: string;
    createdAt: string;
    version: string;
    primaryColor?: string;
    foreignColor?: string;
    colorScheme?: string;
    seed?: string;
  };
  showDetails?: boolean;
  imageSize?: number;
  imageFilter?: string;
  className?: string;
}

export const AvatarCard = ({ avatar, showDetails = true, className = '' }: AvatarCardProps) => {
  const { t } = useTranslation();

  const [avatarData, setAvatarData] = useState<Avatar | null>(null);

  useEffect(() => {
    AvatarApi.getById(avatar.id).then(setAvatarData);
  }, [avatar.id]);

  return (
    <div className={`border rounded-lg p-4 bg-card hover:shadow-lg transition-shadow ${className}`}>
      <div className="aspect-square bg-muted rounded-md mb-3 overflow-hidden">
        <img
          src={avatarData?.id}
          alt={avatar.name}
          className="w-full h-full object-cover"
          onError={() => <FailImage />}
        />
      </div>

      {showDetails && (
        <div className="space-y-1">
          <Link
            to="/avatar-viewer"
            search={{ id: avatar.id }}
            className="text-xs font-medium truncate text-primary hover:text-primary/80 transition-colors block"
            title={avatar.id}
          >
            {t('pages.home.avatarId')}: {avatar.id.slice(0, 8)}...
          </Link>
          <p className="text-xs text-muted-foreground">
            {new Date(avatar.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};
