import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AvatarGeneratorForm,
  AvatarLinkCopySection,
  AvatarGeneratorProvider,
  EmojiAvatarGeneratorForm,
  EmojiServiceHealthCheck,
} from '@/features/avatar-generator';
import type { EmojiAvatarFormData } from '@/features/avatar-generator/types';
import { Card, Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui';
import { Description } from './Description';

export const AvatarGeneratorPage = () => {
  const { t } = useTranslation();

  const [emojiFormData, setEmojiFormData] = useState<EmojiAvatarFormData>({
    emoji: '😀',
    backgroundType: 'solid',
    primaryColor: '#3b82f6',
    foreignColor: '#ef4444',
    angle: 90,
    emojiSize: 'large',
  });

  const handleEmojiFormDataChange = (field: keyof EmojiAvatarFormData, value: string | number) => {
    setEmojiFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <AvatarGeneratorProvider>
      <div className="py-8">
        <div className="max-w mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t('pages.avatarGenerator.title')}
            </h1>
            <p className="text-muted-foreground">{t('pages.avatarGenerator.subtitle')}</p>
          </div>

          <Tabs defaultValue="classic" className="mb-6">
            <TabsList className="bg-stone-50 dark:bg-stone-900 rounded-lg p-1 mb-3">
              <TabsTrigger className="text-white data-[state=active]:bg-blue-600" value="classic">
                Classic
              </TabsTrigger>
              <TabsTrigger className="text-white data-[state=active]:bg-blue-600" value="emoji">
                Emoji
              </TabsTrigger>
            </TabsList>

            <TabsContent value="classic">
              <Card className='p-4 bg-card border-0'>
                <AvatarGeneratorForm />
              </Card>
            </TabsContent>

            <TabsContent value="emoji">
              <Card className='p-4 bg-card border-0'>
                <EmojiServiceHealthCheck>
                  <EmojiAvatarGeneratorForm
                    formData={emojiFormData}
                    onFormDataChange={handleEmojiFormDataChange}
                  />
                </EmojiServiceHealthCheck>
              </Card>
            </TabsContent>
          </Tabs>

          <AvatarLinkCopySection />

          <Description />
        </div>
      </div>
    </AvatarGeneratorProvider>
  );
};
