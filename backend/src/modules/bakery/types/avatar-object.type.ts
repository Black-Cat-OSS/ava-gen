export interface AvatarObject {
  template_id: string;
  build_stages: string[];
  images: {
    image_4n: Buffer;
    image_5n: Buffer;
    image_6n: Buffer;
    image_7n: Buffer;
    image_8n: Buffer;
    image_9n: Buffer;
  };
  filtered_images?: {
    [size: number]: {
      [filterType: string]: Buffer;
    };
  };
  payload?: object;
  metadata: {
    id: string;
    createdAt: Date;
    version: string;
    type: string;
    primaryColor?: string;
    foreignColor?: string;
    colorScheme?: string;
    seed?: string;
    angle?: number;
    customParameters?: Record<string, unknown>;
    creationContext: {
      migrated?: boolean;
      originalVersion?: string;
      migratedAt?: Date;
      migrationChain?: string[];
      buildEnvironment?: {
        nodeVersion: string;
        platform: string;
        timestamp: Date;
      };
    };
    performanceMetrics: {
      generationTime: number;
      memoryUsage: number;
      cpuUsage: number;
      filterProcessingTime?: number;
      totalBuildTime: number;
    };
    filterProcessingInfo?: {
      enabledFilters: string[];
      processingTime: number;
      processedAt: Date;
      cacheStats: Record<string, unknown>;
    };
  };
}
