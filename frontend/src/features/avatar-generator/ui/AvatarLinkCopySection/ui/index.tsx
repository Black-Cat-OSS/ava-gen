import { useAvatarGeneratorContext } from '@/features/avatar-generator/contexts';
import { AvatarLinkCopy } from '@/features/avatar-link-copy';
import { useLocalTranslations } from '@/features/avatar-link-copy/hooks';

/**
 * AvatarLinkCopySection component - displays avatar link copy component
 * Uses context to get generated avatar data
 */
export const AvatarLinkCopySection = () => {
  useLocalTranslations();
  const { generatedAvatar } = useAvatarGeneratorContext();

  if (!generatedAvatar) {
    return null;
  }

  return (
    <div className="mt-6">
      <AvatarLinkCopy avatarId={generatedAvatar.id} size={128} filter="" />
    </div>
  );
};
