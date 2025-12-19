import type { ImageSizes, ImageFilters } from '@/shared/types/avatar';

export interface AvatarLinkCopyProps {
  avatarId: string;
  size?: ImageSizes;
  filter?: ImageFilters;
}
