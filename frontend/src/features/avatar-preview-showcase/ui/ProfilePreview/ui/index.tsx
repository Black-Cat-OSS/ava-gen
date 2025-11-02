import { useTranslation } from 'react-i18next';
import { useAvatarShape } from '@/features/avatar-preview-showcase/hooks';
import type { PreviewContextProps } from '@/features/avatar-preview-showcase/types';
import { type FC } from 'react';
import { FailImage } from '@/shared';
import { getImageUrl } from '@/shared/lib/utils';

/**
 * ProfilePreview component - shows avatar in a profile card context
 */
export const ProfilePreview: FC<PreviewContextProps> = ({ avatar }) => {
  const { t } = useTranslation('featuresAvatarPreviewShowcase');
  const { shape } = useAvatarShape();

  return (
    <div className="flex flex-col items-center text-center space-y-3">
      <img
        src={getImageUrl(avatar.id, { size: 6 })}
        alt={avatar.name}
        className={`w-20 h-20 ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'} border-2 border-border shadow-sm`}
        title="Avatar size: 80px (6th power of 2)"
        onError={() => <FailImage />}
      />

      <div>
        <h4 className="text-sm font-semibold text-foreground">{t('contexts.profile.userName')}</h4>
        <p className="text-xs text-muted-foreground mb-1">{t('contexts.profile.role')}</p>
        <p className="text-xs text-muted-foreground">{t('contexts.profile.location')}</p>
      </div>
    </div>
  );
};
