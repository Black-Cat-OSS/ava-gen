import { useAvatars } from '@/shared/lib';
import { useLocalTranslations } from '@/features/avatar-preview-showcase/hooks/useLocalTranslations';
import { AvatarShapeProvider } from '@/features/avatar-preview-showcase/contexts';
import { PREVIEW_CONTEXTS } from '@/features/avatar-preview-showcase/constants/preview-contexts';
import { PreviewCard } from '@/features/avatar-preview-showcase/ui/PreviewCard';
import { AvatarShapeToggle } from '@/features/avatar-preview-showcase/ui/AvatarShapeToggle';
import type { AvatarPreviewShowcaseProps } from '@/features/avatar-preview-showcase/types';

/**
 * AvatarPreviewShowcase component - main showcase section with avatar previews
 * Shows real-world examples of how avatars look in different contexts
 */
export const AvatarPreviewShowcase: React.FC<AvatarPreviewShowcaseProps> = ({ className = '' }) => {
  const { t } = useLocalTranslations();
  const { data: avatarsData, isLoading, isError } = useAvatars({ pick: 6, offset: 0 });

  const avatars = avatarsData?.items || [];

  if (isLoading) {
    return (
      <AvatarShapeProvider>
        <section className={`py-12 ${className}`}>
          <div className="mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">{t('section.title')}</h2>
              <p className="text-muted-foreground">{t('section.subtitle')}</p>
            </div>

            <div className="flex flex-col items-end mb-8">
              <AvatarShapeToggle />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg border border-border p-6 animate-pulse"
                >
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="bg-background rounded-md p-4">
                    <div className="h-16 bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AvatarShapeProvider>
    );
  }

  if (isError || avatars.length === 0) {
    return (
      <AvatarShapeProvider>
        <section className={`py-12 ${className}`}>
          <div className="mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">{t('section.title')}</h2>
              <p className="text-muted-foreground">{t('section.subtitle')}</p>
            </div>

            <div className="flex flex-col items-end mb-8">
              <AvatarShapeToggle />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PREVIEW_CONTEXTS.map((context, index) => {
                const PreviewComponent = context.component;

                const fallbackAvatar = {
                  id: `fallback-${index}`,
                  name: `Avatar ${index + 1}`,
                  createdAt: new Date().toISOString(),
                  version: '1.0',
                };

                return (
                  <PreviewCard
                    key={context.id}
                    title={t(context.titleKey)}
                    description={t(context.descriptionKey)}
                  >
                    <PreviewComponent avatar={fallbackAvatar} />
                  </PreviewCard>
                );
              })}
            </div>
          </div>
        </section>
      </AvatarShapeProvider>
    );
  }

  return (
    <AvatarShapeProvider>
      <section className={`py-12 ${className}`}>
        <div className="mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t('section.title')}</h2>
            <p className="text-muted-foreground">{t('section.subtitle')}</p>
          </div>

          <div className="flex justify-end mb-8">
            <AvatarShapeToggle />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PREVIEW_CONTEXTS.map((context, index) => {
              const PreviewComponent = context.component;
              const avatar = avatars[index % avatars.length]; // Cycle through available avatars

              return (
                <PreviewCard
                  key={context.id}
                  title={t(context.titleKey)}
                  description={t(context.descriptionKey)}
                >
                  <PreviewComponent avatar={avatar} />
                </PreviewCard>
              );
            })}
          </div>
        </div>
      </section>
    </AvatarShapeProvider>
  );
};
