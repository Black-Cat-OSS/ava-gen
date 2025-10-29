import { t } from 'i18next';

export const Description = () => {
  return (
    <div className="mt-8 text-center">
      <p className="text-sm text-muted-foreground">{t('pages.avatarGenerator.description')}</p>
    </div>
  );
};
