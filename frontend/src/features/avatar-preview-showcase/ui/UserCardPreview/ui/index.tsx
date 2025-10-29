import { useTranslation } from 'react-i18next';
import { useAvatarShape } from '@/features/avatar-preview-showcase/hooks';
import type { PreviewContextProps } from '@/features/avatar-preview-showcase/types';
import { type FC } from 'react';
import { FailImage } from '@/shared';
import { getImageUrl } from '@/shared/lib/utils';

/**
 * UserCardPreview component - shows avatar in a user card component context
 */
export const UserCardPreview: FC<PreviewContextProps> = ({ avatar }) => {
  const { t } = useTranslation('avatarPreviewShowcase');
  const { shape } = useAvatarShape();

  return (
    <div className="flex items-center space-x-3 p-3">
      <img
        src={getImageUrl(avatar.id, { size: 7 })}
        alt={avatar.name}
        className={`w-16 h-16 ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'} border border-border`}
        title="Avatar size: 64px (6th power of 2)"
        onError={() => <FailImage />}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground truncate">
            {t('contexts.userCard.userName')}
          </h4>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            {t('contexts.userCard.status')}
          </span>
        </div>

        <p className="text-xs text-muted-foreground truncate">{t('contexts.userCard.email')}</p>
      </div>
    </div>
  );
};
