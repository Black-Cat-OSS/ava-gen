export type FileFormat = 'json' | 'binary' | 'compressed';

export interface FileStructure {
  header: {
    version: string;
    type: string;
    createdAt: string;
    objectId: string;
    templateId: string;
    format: FileFormat;
  };
  
  metadata: Record<string, unknown>;
  
  bufferCounts: {
    originalImages: number;
    filteredImages: number;
  };
  
  buffers: {
    original: {
      image_4n: string;
      image_5n: string;
      image_6n: string;
      image_7n: string;
      image_8n: string;
      image_9n: string;
    };
    
    filtered: Record<string, Record<string, string>>;
  };
  
  payload?: Record<string, unknown>;
  
  buildInfo: {
    stages: string[];
    totalSize: number;
    bakedAt: string;
  };
}
