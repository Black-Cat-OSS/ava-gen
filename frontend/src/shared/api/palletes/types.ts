export interface PaletteResponse {
  palettes: Array<{
    name: string;
    primaryColor: string;
    foreignColor: string;
    key: string;
  }>;
  pagination: {
    total: number;
    offset: number;
    pick: number;
    hasMore: boolean;
  };
}

export interface ListPalletesParams {
  pick: number;
  offset: number;
}
