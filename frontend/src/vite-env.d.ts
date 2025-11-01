/// <reference types="vite/client" />
interface ImportMetaEnv extends APIClient {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface APIClient {
  readonly VITE_API_BASE_URL: string;
}

declare module 'virtual:i18n-resources' {
  export const i18nResources: Record<string, Record<string, Record<string, unknown>>>;
  export const supportedLanguages: string[];
  export type I18nResources = typeof i18nResources;
}
