import { useLocalTranslations } from '@/features/avatar-preview-showcase/hooks/useLocalTranslations';
import { AvatarShapeProvider } from '@/features/avatar-preview-showcase/contexts';
import { AvatarShapeToggle } from '@/features/avatar-preview-showcase/ui/AvatarShapeToggle';
import type { AvatarPreviewShowcaseProps } from '@/features/avatar-preview-showcase/types';
import { Suspense } from 'react';
import { Skeleton } from './Skeleton';
import { ErrorBoundary, useAvatars } from '@/shared';
import { CommentPreview } from '../../CommentPreview';
import { ChatMessagePreview } from '../../ChatMessagePreview';
import { ForumPostPreview } from '../../ForumPostPreview';
import { ProfilePreview } from '../../ProfilePreview';
import { UserCardPreview } from '../../UserCardPreview';
import { UserListPreview } from '../../UserListPreview';
import { PreviewCard } from '../../PreviewCard';

/**
 * AvatarPreviewShowcase component - main showcase section with avatar previews
 * Shows real-world examples of how avatars look in different contexts
 */
export const AvatarPreviewShowcase: React.FC<AvatarPreviewShowcaseProps> = ({ className = '' }) => {
  const { t } = useLocalTranslations();

  return (
    <section className={`py-12 ${className}`}>
      <AvatarShapeProvider>
        <div className="mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t('section.title')}</h2>
            <p className="text-muted-foreground">{t('section.subtitle')}</p>
          </div>

          <div className="flex justify-end mb-8">
            <AvatarShapeToggle />
          </div>

          <ErrorBoundary>
            <Suspense fallback={<Skeleton />}>
              <AvatarPreviewShowcaseContent />
            </Suspense>
          </ErrorBoundary>
        </div>
      </AvatarShapeProvider>
    </section>
  );
};

const AvatarPreviewShowcaseContent = () => {
  const { data, isError, error } = useAvatars({ pick: 6, offset: 0 });

  if (isError) throw new Error('No avatars found', { cause: error });

  const { t } = useLocalTranslations();

  return (
    data && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PreviewCard
          title={t('contexts.comment.title')}
          description={t('contexts.comment.description')}
        >
          <CommentPreview avatar={data.items[0]} />
        </PreviewCard>
        <PreviewCard
          title={t('contexts.profile.title')}
          description={t('contexts.profile.description')}
        >
          <ProfilePreview avatar={data.items[1]} />
        </PreviewCard>
        <PreviewCard
          title={t('contexts.userCard.title')}
          description={t('contexts.userCard.description')}
        >
          <UserCardPreview avatar={data.items[2]} />
        </PreviewCard>
        <PreviewCard
          title={t('contexts.chatMessage.title')}
          description={t('contexts.chatMessage.description')}
        >
          <ChatMessagePreview avatar={data.items[3]} />
        </PreviewCard>
        <PreviewCard
          title={t('contexts.userList.title')}
          description={t('contexts.userList.description')}
        >
          <UserListPreview avatar={data.items[4]} />
        </PreviewCard>
        <PreviewCard
          title={t('contexts.forumPost.title')}
          description={t('contexts.forumPost.description')}
        >
          <ForumPostPreview avatar={data.items[5]} />
        </PreviewCard>
      </div>
    )
  );
};
