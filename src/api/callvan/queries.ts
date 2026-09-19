import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { getViewerScope } from 'utils/ts/getViewerScope';

import type { CallvanListRequest } from './entity';
import {
  getCallvanChat,
  getCallvanList,
  getCallvanNotifications,
  getCallvanPostDetail,
  getCallvanRestriction,
} from './index';

const CALLVAN_LIST_LIMIT = 10;

type CallvanInfiniteListParams = Omit<CallvanListRequest, 'page' | 'limit'>;

export const callvanQueryKeys = {
  all: ['callvan'] as const,
  listRoot: ['callvan', 'list'] as const,
  list: (params: CallvanListRequest, token?: string | null) =>
    [...callvanQueryKeys.listRoot, params, getViewerScope(token)] as const,
  infiniteListRoot: ['callvan', 'infinite-list'] as const,
  infiniteList: (params: CallvanInfiniteListParams, token?: string | null) =>
    [...callvanQueryKeys.infiniteListRoot, params, getViewerScope(token)] as const,
  notifications: (token: string) => ['callvan', 'notifications', getViewerScope(token)] as const,
  restriction: (token: string) => ['callvan', 'restriction', getViewerScope(token)] as const,
  postDetail: (postId: number, token?: string | null) =>
    ['callvan', 'post-detail', postId, getViewerScope(token)] as const,
  chat: (postId: number, token?: string | null) => ['callvan', 'chat', postId, getViewerScope(token)] as const,
};

export const callvanQueries = {
  list: (token: string, params: CallvanListRequest) =>
    queryOptions({
      queryKey: callvanQueryKeys.list(params, token),
      queryFn: () => getCallvanList(token, params),
    }),

  infiniteList: (token: string, params: CallvanInfiniteListParams) =>
    infiniteQueryOptions({
      queryKey: callvanQueryKeys.infiniteList(params, token),
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        getCallvanList(token, {
          ...params,
          page: pageParam,
          limit: CALLVAN_LIST_LIMIT,
        }),
      getNextPageParam: (lastPage) => {
        if (lastPage.current_page < lastPage.total_page) {
          return lastPage.current_page + 1;
        }

        return undefined;
      },
    }),

  notifications: (token: string) =>
    queryOptions({
      queryKey: callvanQueryKeys.notifications(token),
      queryFn: () => getCallvanNotifications(token),
      staleTime: 60000,
    }),

  restriction: (token: string) =>
    queryOptions({
      queryKey: callvanQueryKeys.restriction(token),
      queryFn: () => getCallvanRestriction(token),
      staleTime: 0,
    }),

  postDetail: (token: string, postId: number) =>
    queryOptions({
      queryKey: callvanQueryKeys.postDetail(postId, token),
      queryFn: () => getCallvanPostDetail(token, postId),
      staleTime: 60000,
    }),

  chat: (token: string, postId: number) =>
    queryOptions({
      queryKey: callvanQueryKeys.chat(postId, token),
      queryFn: () => getCallvanChat(token, postId),
      staleTime: 0,
      refetchInterval: 1000,
    }),
};
