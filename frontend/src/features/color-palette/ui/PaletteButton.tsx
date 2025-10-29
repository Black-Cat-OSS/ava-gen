import type { Pallete } from '@/entities';

/**
 * Props for the PaletteButton component
 */
export interface PaletteButtonProps {
  /** Palette data to display */
  palette: Pallete;
  /** Whether this palette is currently selected */
  isSelected: boolean;
  /** Callback when palette is clicked */
  onClick: (palette: Pallete) => void;
}

/**
 * Button component for selecting a color palette
 * Displays primary and foreign colors with visual preview
 *
 * @param props - Component props
 */
export const PaletteButton = ({ palette, isSelected, onClick }: PaletteButtonProps) => {
  return (
    <button
      type="button"
      onClick={() => onClick(palette)}
      className={`p-3 rounded-lg border-2 transition-all`}
      style={{
        borderColor: isSelected ? palette.primaryColor : undefined,
        backgroundColor: isSelected ? `${palette.primaryColor}15` : undefined,
        boxShadow: isSelected ? `0 0 0 3px ${palette.primaryColor}50, 0 0 0 8px ${palette.primaryColor}20` : undefined,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-[50%] h-8 rounded-sm border border-border"
          style={{ backgroundColor: palette.primaryColor }}
        />
        <div
          className="w-[50%] h-8 rounded-sm border border-border"
          style={{ backgroundColor: palette.foreignColor }}
        />
      </div>
      <p className="text-xs text-center text-muted-foreground">{palette.name}</p>
    </button>
  );
};

