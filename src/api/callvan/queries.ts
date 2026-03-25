import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { CallvanListRequest } from './entity';
import { getCallvanChat, getCallvanList, getCallvanNotifications, getCallvanPostDetail } from './index';

const CALLVAN_LIST_LIMIT = 10;

type CallvanInfiniteListParams = Omit<CallvanListRequest, 'page' | 'limit'>;

export const callvanQueryKeys = {
  all: ['callvan'] as const,
  listRoot: ['callvan', 'list'] as const,
  list: (params: CallvanListRequest) => [...callvanQueryKeys.listRoot, params] as const,
  infiniteListRoot: ['callvan', 'infinite-list'] as const,
  infiniteList: (params: CallvanInfiniteListParams) => [...callvanQueryKeys.infiniteListRoot, params] as const,
  notifications: ['callvan', 'notifications'] as const,
  postDetail: (postId: number) => ['callvan', 'post-detail', postId] as const,
  chat: (postId: number) => ['callvan', 'chat', postId] as const,
};

export const callvanQueries = {
  list: (token: string, params: CallvanListRequest) =>
    queryOptions({
      queryKey: callvanQueryKeys.list(params),
      queryFn: () => getCallvanList(token, params),
    }),

  infiniteList: (token: string, params: CallvanInfiniteListParams) =>
    infiniteQueryOptions({
      queryKey: callvanQueryKeys.infiniteList(params),
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
      queryKey: callvanQueryKeys.notifications,
      queryFn: () => getCallvanNotifications(token),
    }),

  postDetail: (token: string, postId: number) =>
    queryOptions({
      queryKey: callvanQueryKeys.postDetail(postId),
      queryFn: () => getCallvanPostDetail(token, postId),
      staleTime: 60000,
    }),

  chat: (token: string, postId: number) =>
    queryOptions({
      queryKey: callvanQueryKeys.chat(postId),
      queryFn: () => getCallvanChat(token, postId),
      staleTime: 0,
      refetchInterval: 1000,
    }),
};
