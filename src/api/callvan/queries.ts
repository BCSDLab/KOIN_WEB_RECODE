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
  list: (params: CallvanListRequest, isLoggedIn?: boolean) =>
    [...callvanQueryKeys.listRoot, params, getViewerScope(isLoggedIn)] as const,
  infiniteListRoot: ['callvan', 'infinite-list'] as const,
  infiniteList: (params: CallvanInfiniteListParams, isLoggedIn?: boolean) =>
    [...callvanQueryKeys.infiniteListRoot, params, getViewerScope(isLoggedIn)] as const,
  notifications: (isLoggedIn?: boolean) => ['callvan', 'notifications', getViewerScope(isLoggedIn)] as const,
  restriction: (isLoggedIn?: boolean) => ['callvan', 'restriction', getViewerScope(isLoggedIn)] as const,
  postDetail: (postId: number, isLoggedIn?: boolean) =>
    ['callvan', 'post-detail', postId, getViewerScope(isLoggedIn)] as const,
  chat: (postId: number, isLoggedIn?: boolean) => ['callvan', 'chat', postId, getViewerScope(isLoggedIn)] as const,
};

export const callvanQueries = {
  list: (params: CallvanListRequest, isLoggedIn?: boolean) =>
    queryOptions({
      queryKey: callvanQueryKeys.list(params, isLoggedIn),
      queryFn: () => getCallvanList(params),
    }),

  infiniteList: (params: CallvanInfiniteListParams, isLoggedIn?: boolean) =>
    infiniteQueryOptions({
      queryKey: callvanQueryKeys.infiniteList(params, isLoggedIn),
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        getCallvanList({
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

  notifications: (isLoggedIn?: boolean) =>
    queryOptions({
      queryKey: callvanQueryKeys.notifications(isLoggedIn),
      queryFn: () => getCallvanNotifications(),
      staleTime: 60000,
    }),

  restriction: (isLoggedIn?: boolean) =>
    queryOptions({
      queryKey: callvanQueryKeys.restriction(isLoggedIn),
      queryFn: () => getCallvanRestriction(),
      staleTime: 0,
    }),

  postDetail: (postId: number, isLoggedIn?: boolean) =>
    queryOptions({
      queryKey: callvanQueryKeys.postDetail(postId, isLoggedIn),
      queryFn: () => getCallvanPostDetail(postId),
      staleTime: 60000,
    }),

  chat: (postId: number, isLoggedIn?: boolean) =>
    queryOptions({
      queryKey: callvanQueryKeys.chat(postId, isLoggedIn),
      queryFn: () => getCallvanChat(postId),
      staleTime: 0,
      refetchInterval: 1000,
    }),
};
