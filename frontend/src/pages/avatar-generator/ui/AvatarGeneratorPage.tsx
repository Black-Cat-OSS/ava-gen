import { useTranslation } from 'react-i18next';
import { AvatarGeneratorProvider } from '@/features/avatar-generator';
import { EmojiGeneratorForm } from '@/features/avatar-emoji-generator';
import { AvatarLinkCopySection, ClassicGeneratorForm } from '@/features';
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
          <TabsList className="bg-gray-700 rounded-lg p-1 mb-3">
            <TabsTrigger
              className="text-grey-100 data-[state=active]:text-white data-[state=active]:bg-blue-600"
              value="classic"
            >
              Classic
            </TabsTrigger>
            <TabsTrigger
              className="text-grey-100 data-[state=active]:text-white data-[state=active]:bg-blue-600"
              value="emoji"
            >
              Emoji
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classic">
            <ClassicGeneratorForm />
          </TabsContent>

          <TabsContent value="emoji">
            <EmojiGeneratorForm />
          </TabsContent>
        </Tabs>

        <AvatarLinkCopySection />

        <Description />
      </div>
    </AvatarGeneratorProvider>
  );
};
