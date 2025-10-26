export interface Avatar {
    id: string;
    name: string;
    createdAt: string;
    version: string;
    primaryColor?: string;
    foreignColor?: string;
    colorScheme?: string;
    seed?: string;
    generatorType?: string;
  }