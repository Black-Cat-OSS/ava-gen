import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  AvatarGeneratorForm, 
  AvatarLinkCopySection, 
  AvatarGeneratorProvider,
  EmojiAvatarGeneratorForm,
  EmojiServiceHealthCheck
} from '@/features/avatar-generator';
import type { EmojiAvatarFormData } from '@/features/avatar-generator/types';
import { Button, Card, Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui';
import { Description } from './Description';

type GeneratorType = 'classic' | 'emoji';

export const AvatarGeneratorPage = () => {
  const { t } = useTranslation();
  const [generatorType, setGeneratorType] = useState<GeneratorType>('classic');
  
  // Default emoji form data
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
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t('pages.avatarGenerator.title')}
            </h1>
            <p className="text-muted-foreground">{t('pages.avatarGenerator.subtitle')}</p>
          </div>

          <Tabs defaultValue="classic" className="mb-6">
            <TabsList className="bg-stone-900 rounded-lg p-1 mb-3">
              <TabsTrigger className="text-white data-[state=active]:bg-blue-600" value="classic">
                Classic
              </TabsTrigger>
              <TabsTrigger className="text-white data-[state=active]:bg-blue-600" value="emoji">
                Emoji
              </TabsTrigger>
            </TabsList>

            <TabsContent value="classic">
              <Card>
                <AvatarGeneratorForm />
              </Card>
            </TabsContent>

            <TabsContent value="emoji">
              <Card>
                <EmojiServiceHealthCheck>
                  <EmojiAvatarGeneratorForm
                    formData={emojiFormData}
                    onFormDataChange={handleEmojiFormDataChange}
                  />
                </EmojiServiceHealthCheck>
              </Card>
            </TabsContent>
          </Tabs>

          {/* <div className="mb-6">
            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
              <Button
                variant={generatorType === 'classic' ? 'default' : 'ghost'}
                onClick={() => setGeneratorType('classic')}
                className="flex-1"
              >
                {t('pages.avatarGenerator.generatorTypes.classic')}
              </Button>
              <Button
                variant={generatorType === 'emoji' ? 'default' : 'ghost'}
                onClick={() => setGeneratorType('emoji')}
                className="flex-1"
              >
                {t('pages.avatarGenerator.generatorTypes.emoji')}
              </Button>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6 shadow-sm">
            {generatorType === 'classic' ? (
              <AvatarGeneratorForm />
            ) : (
              <EmojiServiceHealthCheck>
                <EmojiAvatarGeneratorForm
                  formData={emojiFormData}
                  onFormDataChange={handleEmojiFormDataChange}
                />
              </EmojiServiceHealthCheck>
            )}
          </div> */}

          {/* Avatar Link Copy Section - separate from form */}
          <AvatarLinkCopySection />

          <Description />
        </div>
      </div>
    </AvatarGeneratorProvider>
  );
};
