import { useTranslation } from 'react-i18next';
import { AvatarApi } from '@/shared/api/avatar';
import { useAvatarShape } from '@/features/avatar-preview-showcase/hooks';
import type { PreviewContextProps } from '@/features/avatar-preview-showcase/types';
import { useEffect, useState, type FC } from 'react';
import type { Avatar } from '@/entities';
import { FailImage } from '@/shared';

/**
 * UserListPreview component - shows avatar in a user list context
 */
export const UserListPreview: FC<PreviewContextProps> = ({ avatar }) => {
  const { t } = useTranslation('avatarPreviewShowcase');
  const { shape } = useAvatarShape();

  const users = [
    { name: t('contexts.userList.users.0.name'), role: t('contexts.userList.users.0.role') },
    { name: t('contexts.userList.users.1.name'), role: t('contexts.userList.users.1.role') },
    { name: t('contexts.userList.users.2.name'), role: t('contexts.userList.users.2.role') },
  ];

  const [avatarData, setAvatarData] = useState<Avatar | null>(null);

  useEffect(() => {
    AvatarApi.getById(avatar.id).then(setAvatarData);
  }, [avatar.id]);

  return (
    <div className="space-y-3">
      {users.map((user, index) => (
        <div key={index} className="flex items-center space-x-3">
          <img
            src={avatarData?.id}
            alt={user.name}
            className={`w-6 h-6 ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'} border border-border`}
            title="Avatar size: 24px (5th power of 2)"
            onError={() => <FailImage />}
          />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
