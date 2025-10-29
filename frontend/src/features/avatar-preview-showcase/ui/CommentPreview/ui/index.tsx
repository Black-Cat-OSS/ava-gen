import { useTranslation } from 'react-i18next';
import { useAvatarShape } from '../../../hooks';
import type { PreviewContextProps } from '../../../types';
import { Suspense } from 'react';
import { LoadingSkeleton } from './Skeleton';
import { FailImage } from '@/shared';
import { getImageUrl } from '@/shared/lib/utils';

/**
 * CommentPreview component - shows avatar in a blog comment context
 */
export const CommentPreview: React.FC<PreviewContextProps> = ({ avatar }) => {
  const { t } = useTranslation('avatarPreviewShowcase');
  const { shape } = useAvatarShape();

  return (
    avatar && (
      <Suspense fallback={<LoadingSkeleton />}>
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <img
              src={getImageUrl(avatar.id, { size: 5 })}
              alt={avatar.name}
              className={`w-10 h-10 ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'} border border-border`}
              title="Avatar size: 40px (5th power of 2)"
              onError={() => <FailImage />}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-foreground">
                {t('contexts.comment.userName')}
              </span>
              <span className="text-xs text-muted-foreground">
                {t('contexts.comment.timestamp')}
              </span>
            </div>

            <p className="text-sm text-muted-foreground">{t('contexts.comment.text')}</p>
          </div>
        </div>
      </Suspense>
    )
  );
};
