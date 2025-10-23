import type { PreviewCardProps } from '../types';

/**
 * PreviewCard component - wrapper for each preview example
 * Provides consistent styling and layout for preview contexts
 */
export const PreviewCard: React.FC<PreviewCardProps> = ({
  title,
  description,
  children,
}) => {

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      <div className="bg-background/50 rounded-md p-4">
        {children}
      </div>
    </div>
  );
};
