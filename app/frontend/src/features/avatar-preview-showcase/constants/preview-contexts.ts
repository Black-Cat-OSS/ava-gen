import { CommentPreview } from '../ui/CommentPreview';
import { ProfilePreview } from '../ui/ProfilePreview';
import { UserCardPreview } from '../ui/UserCardPreview';
import { ChatMessagePreview } from '../ui/ChatMessagePreview';
import { UserListPreview } from '../ui/UserListPreview';
import { ForumPostPreview } from '../ui/ForumPostPreview';
import type { PreviewContextConfig } from '../types';

/**
 * Configuration for all preview contexts
 */
export const PREVIEW_CONTEXTS: PreviewContextConfig[] = [
  {
    id: 'comment',
    component: CommentPreview,
    titleKey: 'contexts.comment.title',
    descriptionKey: 'contexts.comment.description',
  },
  {
    id: 'profile',
    component: ProfilePreview,
    titleKey: 'contexts.profile.title',
    descriptionKey: 'contexts.profile.description',
  },
  {
    id: 'userCard',
    component: UserCardPreview,
    titleKey: 'contexts.userCard.title',
    descriptionKey: 'contexts.userCard.description',
  },
  {
    id: 'chatMessage',
    component: ChatMessagePreview,
    titleKey: 'contexts.chatMessage.title',
    descriptionKey: 'contexts.chatMessage.description',
  },
  {
    id: 'userList',
    component: UserListPreview,
    titleKey: 'contexts.userList.title',
    descriptionKey: 'contexts.userList.description',
  },
  {
    id: 'forumPost',
    component: ForumPostPreview,
    titleKey: 'contexts.forumPost.title',
    descriptionKey: 'contexts.forumPost.description',
  },
] as const;
