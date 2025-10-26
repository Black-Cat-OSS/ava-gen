import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * Entity for color palettes
 * Stores color scheme definitions for avatar generation
 */
@Entity('palettes')
export class Palette {
  /**
   * Unique identifier
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Human-readable palette name
   */
  @Column({ length: 100 })
  name: string;

  /**
   * Unique key for palette identification
   */
  @Column({ unique: true, length: 50 })
  @Index('IDX_palette_key')
  key: string;

  /**
   * Primary color in hex format (e.g., #3B82F6)
   */
  @Column({ length: 7 })
  primaryColor: string;

  /**
   * Secondary/foreign color in hex format (e.g., #EF4444)
   */
  @Column({ length: 7 })
  foreignColor: string;

  /**
   * Creation timestamp
   */
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  /**
   * Last update timestamp
   */
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
