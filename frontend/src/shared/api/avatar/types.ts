import type { Avatar } from '@/entities';

export interface ListAvatarsResponse {
  avatars: Avatar[];
  pagination: {
    total: number;
    offset: number;
    pick: number;
    hasMore: boolean;
  };
}

export interface ListAvatarsParams {
  pick: number;
  offset: number;
}
