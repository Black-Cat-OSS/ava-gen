import { useTranslation } from 'react-i18next';
import { AvatarApi } from '@/shared/api/avatar';
import { useAvatarShape } from '@/features/avatar-preview-showcase/hooks';
import type { PreviewContextProps } from '@/features/avatar-preview-showcase/types';
import { useEffect, useState } from 'react';
import type { Avatar } from '@/entities';
import { FailImage } from '@/shared';

/**
 * ForumPostPreview component - shows avatar in a forum post context
 */
export const ForumPostPreview: React.FC<PreviewContextProps> = ({ avatar }) => {
  const { t } = useTranslation('avatarPreviewShowcase');
  const { shape } = useAvatarShape();

  const [avatarData, setAvatarData] = useState<Avatar | null>(null);

  useEffect(() => {
    AvatarApi.getById(avatar.id).then(setAvatarData);
  }, [avatar.id]);

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <img
          src={avatarData?.id}
          alt={avatar.name}
          className={`w-16 h-16 ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'} border border-border`}
          title="Avatar size: 128px (7th power of 2)"
          onError={() => <FailImage />}
        />

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-foreground">
            {t('contexts.forumPost.userName')}
          </h4>
          <p className="text-xs text-muted-foreground">{t('contexts.forumPost.title')}</p>
        </div>
      </div>

      <div className="border-l-2 border-muted/50 pl-4">
        <p className="text-sm text-muted-foreground mb-2">{t('contexts.forumPost.text')}</p>

        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span className="hover:text-foreground cursor-pointer">
            {t('contexts.forumPost.replies')}
          </span>
        </div>
      </div>
    </div>
  );
};
