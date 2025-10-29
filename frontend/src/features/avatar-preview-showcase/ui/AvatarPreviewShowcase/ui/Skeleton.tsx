import { AvatarShapeProvider, AvatarShapeToggle } from '@/features/avatar-preview-showcase';
import { t } from 'i18next';

export const Skeleton = () => {
  return (
    <AvatarShapeProvider>
      <section className={`py-12`}>
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
};
