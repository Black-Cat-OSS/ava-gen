import { useTranslation } from 'react-i18next';
import { AvatarGeneratorProvider } from '@/features/avatar-generator';
import {
  AvatarLinkCopySection,
  AvatarPreviewSection,
  ClassicGeneratorForm,
  EmojiGeneratorForm,
} from '@/features';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui';
import { Description } from './Description';

export const AvatarGeneratorPage = () => {
  const { t } = useTranslation();

  return (
    <AvatarGeneratorProvider>
      <div className="py-8 max-w mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {t('pages.avatarGenerator.title')}
          </h1>
          <p className="text-muted-foreground">{t('pages.avatarGenerator.subtitle')}</p>
        </div>

        <Tabs defaultValue="classic" className="mb-6">
          <TabsList className="mb-3">
            <TabsTrigger value="classic">Classic</TabsTrigger>
            <TabsTrigger value="emoji">Emoji</TabsTrigger>
          </TabsList>

          <TabsContent value="classic">
            <ClassicGeneratorForm />
          </TabsContent>

          <TabsContent value="emoji">
            <EmojiGeneratorForm />
          </TabsContent>
        </Tabs>

        <AvatarPreviewSection />
        <AvatarLinkCopySection />

        <Description />
      </div>
    </AvatarGeneratorProvider>
  );
};
