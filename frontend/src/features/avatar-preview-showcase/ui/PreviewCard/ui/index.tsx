import type { PreviewCardProps } from '@/features/avatar-preview-showcase/types';
import { type FC } from 'react';

/**
 * PreviewCard component - wrapper for each preview example
 * Provides consistent styling and layout for preview contexts
 */
export const PreviewCard: FC<PreviewCardProps> = ({ title, description, children }) => {
  return (
    <div className="bg-gray-700 rounded-lg border border-none p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground h-13">{description}</p>
      </div>

      <div className="bg-gray-800 p-3 rounded-md">{children}</div>
    </div>
  );
};
