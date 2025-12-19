export interface ApiRequest<T> {
  getById(id: string): Promise<T>;
  getAll(pick: number, offset: number): Promise<ApiPagination<T>>;
  post(data: T): Promise<T>;
  put(id: string, data: T): Promise<T>;
  delete(id: string): Promise<void>;
}

export interface ApiPagination<T> {
  items: T[];
  pagination: {
    total: number;
    offset: number;
    pick: number;
    hasMore: boolean;
  };
}
