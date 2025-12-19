/**
 * Shape of avatar display
 */
export type AvatarShape = 'circle' | 'square';

/**
 * Context value for avatar shape management
 */
export interface AvatarShapeContextValue {
  /**
   * Current avatar shape
   */
  shape: AvatarShape;
  
  /**
   * Function to change avatar shape
   */
  setShape: (shape: AvatarShape) => void;
}
