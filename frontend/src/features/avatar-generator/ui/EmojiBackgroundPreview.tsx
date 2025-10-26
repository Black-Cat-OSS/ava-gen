import React from 'react';
import type { BackgroundType } from '../types';

interface EmojiBackgroundPreviewProps {
  primaryColor: string;
  foreignColor: string;
  backgroundType: BackgroundType;
  angle?: number;
  className?: string;
}

/**
 * EmojiBackgroundPreview component
 * 
 * Displays a preview of the emoji avatar background with the selected colors and type
 * 
 * @param props - Component props
 * @returns JSX element
 */
export const EmojiBackgroundPreview: React.FC<EmojiBackgroundPreviewProps> = ({
  primaryColor,
  foreignColor,
  backgroundType,
  angle = 90,
  className = '',
}) => {
  const getBackgroundStyle = () => {
    switch (backgroundType) {
      case 'solid':
        return { backgroundColor: primaryColor };
      case 'linear':
        return {
          background: `linear-gradient(${angle}deg, ${primaryColor}, ${foreignColor})`,
        };
      case 'radial':
        return {
          background: `radial-gradient(circle, ${primaryColor}, ${foreignColor})`,
        };
      default:
        return { backgroundColor: primaryColor };
    }
  };

  return (
    <div
      className={`w-full aspect-square rounded-lg border-2 border-border shadow-sm ${className}`}
      style={getBackgroundStyle()}
    />
  );
};

