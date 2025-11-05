type ImageSizes = 4 | 5 | 6 | 7 | 8 | 9;
type ImageFilters = 'grayscale' | 'sepia' | 'negative';

export interface AvatarLinkCopyProps {
  avatarId: string;
  size?: ImageSizes;
  filter?: ImageFilters;
}
