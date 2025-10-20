/**
 * Constants for avatar object processing
 */
export const AVATAR_CONSTANTS = {
  // Image size mappings (4n -> 16px, 5n -> 32px, etc.)
  IMAGE_SIZE_MAPPING: {
    4: 16,   // 2^4 = 16px
    5: 32,   // 2^5 = 32px
    6: 64,   // 2^6 = 64px
    7: 128,  // 2^7 = 128px
    8: 256,  // 2^8 = 256px
    9: 512,  // 2^9 = 512px
  },

  // Version numbers
  VERSIONS: {
    CURRENT: '2.0.0',
    LEGACY: '1.0.0',
    DATABASE_DEFAULT: '0.0.1',
  },

  // File format magic numbers
  MAGIC_NUMBERS: {
    AVATAR_BINARY: 'AVATAR_BINARY',
    COMPRESSED: 'COMPRESSED',
  },

  // File size limits
  FILE_LIMITS: {
    MAX_SIZE: 100 * 1024 * 1024, // 100MB
    MIN_SIZE: 1, // 1 byte
  },

  // Default options
  DEFAULT_OPTIONS: {
    FORMAT: 'json' as const,
    COMPRESSION: false,
    OPTIMIZATION: false,
    INCLUDE_METADATA: true,
    INCLUDE_FILTERED: true,
    VALIDATION: true,
  },
} as const;
