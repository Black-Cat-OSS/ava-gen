import { useAvatarGeneratorContext } from '@/features/avatar-generator/contexts';
import { AvatarLinkCopy } from '@/features/avatar-link-copy';

/**
 * AvatarLinkCopySection component - displays avatar link copy component
 * Uses context to get generated avatar data
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
