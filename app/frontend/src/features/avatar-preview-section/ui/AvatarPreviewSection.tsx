import { useTranslation } from 'react-i18next';
import { useAvatarGeneratorContext } from '@/features/avatar-generator/contexts';
import { getImageUrl } from '@/shared';

/**
 * Компонент превью сгенерированного аватара.
 *
 * Отображает сообщение об успехе и изображение аватара, когда он доступен.
 */
export const AvatarPreviewSection = () => {
  const { generatedAvatar } = useAvatarGeneratorContext();
  const { t } = useTranslation();

  if (!generatedAvatar) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="text-center text-sm text-green-600 dark:text-green-400">
        {t('features.avatarGenerator.success')}
      </div>
      <div className="flex justify-center">
        <img
          src={getImageUrl(generatedAvatar.id, { size: 8 })}
          alt="Generated Avatar"
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};
