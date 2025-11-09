import type { Avatar } from '@/entities';

/**
 * Shape of avatar display
 */
export type AvatarShape = 'circle' | 'square';

/**
 * Props for preview context components
 */
export interface PreviewContextProps {
  avatar: Avatar;
}

/**
 * Configuration for preview context
 */
export interface PreviewContextConfig {
  id: string;
  component: React.ComponentType<PreviewContextProps>;
  titleKey: string;
  descriptionKey: string;
}

/**
 * Props for PreviewCard component
 */
export interface PreviewCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

/**
 * Props for main showcase component
 */
export interface AvatarPreviewShowcaseProps {
  className?: string;
}
