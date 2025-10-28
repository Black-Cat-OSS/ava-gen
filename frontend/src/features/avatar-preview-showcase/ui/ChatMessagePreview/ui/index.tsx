import { Suspense, type FC } from 'react';
import { Sceleton } from './Skeleton';
import { Message } from './Message';
import type { Avatar } from '@/entities';

interface ChatMessagePreviewProps {
  avatar: Avatar;
}

export const ChatMessagePreview: FC<ChatMessagePreviewProps> = ({ avatar }) => {
  return (
    <Suspense fallback={<Sceleton />}>
      <Message avatar={avatar} />
    </Suspense>
  );
};
