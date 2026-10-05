import { queryOptions } from '@tanstack/react-query';
import { getRoomDetailInfo, getRoomList } from './index';

export const roomQueryKeys = {
  all: ['room'] as const,
  list: () => [...roomQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...roomQueryKeys.all, 'detail', id] as const,
};

export const roomQueries = {
  list: () =>
    queryOptions({
      queryKey: roomQueryKeys.list(),
      queryFn: getRoomList,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: roomQueryKeys.detail(id),
      queryFn: () => getRoomDetailInfo(id),
    }),
};
