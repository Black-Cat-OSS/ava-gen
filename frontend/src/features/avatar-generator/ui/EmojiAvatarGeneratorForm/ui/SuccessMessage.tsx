import React from 'react';
import type { Avatar } from '@/entities/avatar';

/**
 * Success message component displaying generated avatar
 *
 * @param props - Component props
 * @param props.avatar - Generated avatar data
 * @param props.t - Translation function
 * @returns JSX element
 */
export const SuccessMessage: React.FC<{
  avatar: Avatar;
  t: (key: string) => string;
}> = ({ avatar, t }) => {
  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
      <p className="text-green-800 text-sm mb-3">{t('features.avatarGenerator.success')}</p>
      <div className="text-center">
        <img
          src={avatar.id}
          alt={avatar.id}
          className="mx-auto rounded-full w-32 h-32 object-cover border-4 border-primary"
        />
        <p className="mt-2 text-sm text-muted-foreground">ID: {avatar.id}</p>
      </div>
    </div>
  );
};
