import { useTranslation } from 'react-i18next';
import { avatarApi } from '@/shared/api/avatar';
import { useAvatarShape } from '../hooks';
import type { PreviewContextProps } from '../types';

/**
 * UserListPreview component - shows avatar in a user list context
 */
export const UserListPreview: React.FC<PreviewContextProps> = ({ avatar }) => {
  const { t } = useTranslation('avatarPreviewShowcase');
  const { shape } = useAvatarShape();

  const users = [
    { name: t('contexts.userList.users.0.name'), role: t('contexts.userList.users.0.role') },
    { name: t('contexts.userList.users.1.name'), role: t('contexts.userList.users.1.role') },
    { name: t('contexts.userList.users.2.name'), role: t('contexts.userList.users.2.role') },
  ];

  return (
    <div className="space-y-3">
      {users.map((user, index) => (
        <div key={index} className="flex items-center space-x-3">
            <img
              src={avatarApi.getImageUrl(avatar.id, undefined, 24)}
              alt={user.name}
              className={`w-6 h-6 ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'} border border-border`}
              title="Avatar size: 24px (5th power of 2)"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24"%3E%3Crect fill="%23ddd" width="24" height="24"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EAvatar%3C/text%3E%3C/svg%3E';
            }}
          />
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.role}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
