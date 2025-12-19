import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { AvatarGeneratorProvider } from '@/features/avatar-generator';
import { useAvatarGeneratorContext } from '@/features/avatar-generator/contexts';
import type { GenerateAvatarResponse } from '@/shared/api/generator/types';
import i18n from '@/shared/lib/utils/i18n';
import { AvatarPreviewSection } from './ui/AvatarPreviewSection';

const mockAvatar: GenerateAvatarResponse = {
  id: 'demo-avatar-id',
  name: 'Demo Avatar',
  filePath: '/demo/avatar.png',
  createdAt: '2024-01-01T00:00:00.000Z',
  version: '1.0.0',
  primaryColor: '#3366FF',
  foreignColor: '#F5F5F5',
  colorScheme: 'demo',
  generatorType: 'pixelize',
};

interface PreviewStateProviderProps {
  children: ReactNode;
}

/**
 * Декоратор для установки тестового состояния генерации аватара.
 */
const PreviewStateProvider = ({ children }: PreviewStateProviderProps) => {
  const { setGeneratedAvatar } = useAvatarGeneratorContext();

  useEffect(() => {
    setGeneratedAvatar(mockAvatar);
  }, [setGeneratedAvatar]);

  return <>{children}</>;
};

const meta: Meta<typeof AvatarPreviewSection> = {
  title: 'Features/AvatarPreviewSection',
  component: AvatarPreviewSection,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <I18nextProvider i18n={i18n}>
        <AvatarGeneratorProvider>
          <PreviewStateProvider>
            <div className="max-w-sm mx-auto p-4">
              <Story />
            </div>
          </PreviewStateProvider>
        </AvatarGeneratorProvider>
      </I18nextProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Превью сгенерированного аватара с сообщением об успешной генерации.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
