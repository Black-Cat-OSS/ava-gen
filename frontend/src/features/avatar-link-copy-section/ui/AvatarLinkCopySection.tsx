import { useAvatarGeneratorContext } from '@/features/avatar-generator/contexts';
import { AvatarLinkCopy } from '@/features/avatar-link-copy';

/**
 * Компонент секции копирования ссылки на аватар.
 *
 * Показывается только после генерации аватара и предоставляет возможность
 * скопировать ссылку на результат.
 */
export const AvatarLinkCopySection = () => {
  const { generatedAvatar } = useAvatarGeneratorContext();

  if (!generatedAvatar) {
    return null;
  }

  return (
    <div className="mt-6">
      <AvatarLinkCopy avatarId={generatedAvatar.id} size={8} />
    </div>
  );
};
