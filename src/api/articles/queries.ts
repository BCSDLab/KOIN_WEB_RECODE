import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { getViewerScope } from 'utils/ts/getViewerScope';

import type { LostItemArticlesRequest, SearchArticlesRequest, SearchLostItemArticleRequest } from './entity';
import {
  getArticle,
  getArticles,
  getArticlesHotKeyword,
  getLostItemChatroomDetail,
  getLostItemChatroomList,
  getLostItemChatroomMessagesV2,
  getHotArticles,
  getLostItemArticles,
  getLostItemSearch,
  getLostItemStat,
  getSingleLostItemArticle,
  searchArticles,
} from './index';

type LostItemInfiniteListParams = Omit<LostItemArticlesRequest, 'page'>;

type LostItemSearchParams = Required<Pick<SearchLostItemArticleRequest, 'query'>> & {
  page: number;
  limit: number;
};

type ArticlesSearchParams = Required<Pick<SearchArticlesRequest, 'query'>> &
  Pick<SearchArticlesRequest, 'boardId' | 'limit'>;

export const articleQueryKeys = {
  all: ['articles'] as const,
  listRoot: ['articles', 'list'] as const,
  list: (page: string, boardId?: number, isLoggedIn?: boolean) =>
    [...articleQueryKeys.listRoot, page, boardId ?? 4, getViewerScope(isLoggedIn)] as const,
  hot: ['articles', 'hot'] as const,
  detail: (id: string) => ['articles', 'detail', id] as const,
  hotKeyword: (count: number) => ['articles', 'hotKeyword', count] as const,
  searchRoot: ['articles', 'search'] as const,
  search: (params: ArticlesSearchParams) => [...articleQueryKeys.searchRoot, params] as const,
  lostItemAll: ['lostItem'] as const,
  lostItemListRoot: ['lostItem', 'list'] as const,
  lostItemList: (params: LostItemArticlesRequest, isLoggedIn?: boolean) =>
    [...articleQueryKeys.lostItemListRoot, params, getViewerScope(isLoggedIn)] as const,
  lostItemInfiniteListRoot: ['lostItem', 'infinite-list'] as const,
  lostItemInfiniteList: (params: LostItemInfiniteListParams, isLoggedIn?: boolean) =>
    [...articleQueryKeys.lostItemInfiniteListRoot, params, getViewerScope(isLoggedIn)] as const,
  lostItemDetail: (articleId: number, isLoggedIn?: boolean) =>
    ['lostItem', 'detail', articleId, getViewerScope(isLoggedIn)] as const,
  lostItemSearch: (params: LostItemSearchParams) => ['lostItem', 'search', params] as const,
  lostItemStat: ['lostItem', 'stat'] as const,
  lostItemChatroomAll: ['chatroom', 'lost-item'] as const,
  lostItemChatroomList: (isLoggedIn?: boolean) =>
    ['chatroom', 'lost-item', 'list', getViewerScope(isLoggedIn)] as const,
  lostItemChatroomDetail: (
    articleId: number | string | null,
    chatroomId: number | string | null,
    isLoggedIn?: boolean,
  ) => ['chatroom', 'lost-item', 'detail', articleId, chatroomId, getViewerScope(isLoggedIn)] as const,
  lostItemChatroomMessages: (
    articleId: number | string | null,
    chatroomId: number | string | null,
    isLoggedIn?: boolean,
  ) => ['chatroom', 'lost-item', 'messages', articleId, chatroomId, getViewerScope(isLoggedIn)] as const,
};

export const articleQueries = {
  list: (isLoggedIn: boolean, page: string, boardId?: number) =>
    queryOptions({
      queryKey: articleQueryKeys.list(page, boardId, isLoggedIn),
      queryFn: () => getArticles(page, boardId),
    }),

  hot: () =>
    queryOptions({
      queryKey: articleQueryKeys.hot,
      queryFn: getHotArticles,
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: articleQueryKeys.detail(id),
      queryFn: () => getArticle(id),
    }),

  hotKeyword: (count: number) =>
    queryOptions({
      queryKey: articleQueryKeys.hotKeyword(count),
      queryFn: () => getArticlesHotKeyword(count),
    }),

  search: (params: ArticlesSearchParams) =>
    infiniteQueryOptions({
      queryKey: articleQueryKeys.search(params),
      initialPageParam: 1,
      queryFn: ({ pageParam }) => searchArticles({ ...params, page: pageParam }),
      getNextPageParam: (lastPage) => {
        if (lastPage.total_page > lastPage.current_page) {
          return lastPage.current_page + 1;
        }

        return undefined;
      },
    }),

  lostItemList: (isLoggedIn: boolean, params: LostItemArticlesRequest) =>
    queryOptions({
      queryKey: articleQueryKeys.lostItemList(params, isLoggedIn),
      queryFn: () => getLostItemArticles(params),
    }),

  lostItemInfiniteList: (isLoggedIn: boolean, params: LostItemInfiniteListParams) =>
    infiniteQueryOptions({
      queryKey: articleQueryKeys.lostItemInfiniteList(params, isLoggedIn),
      initialPageParam: 1,
      queryFn: ({ pageParam }) => getLostItemArticles({ ...params, page: pageParam }),
      getNextPageParam: (lastPage) => {
        if (lastPage.total_page > lastPage.current_page) {
          return lastPage.current_page + 1;
        }

        return undefined;
      },
    }),

  lostItemDetail: (isLoggedIn: boolean, articleId: number) =>
    queryOptions({
      queryKey: articleQueryKeys.lostItemDetail(articleId, isLoggedIn),
      queryFn: () => getSingleLostItemArticle(articleId),
    }),

  lostItemSearch: (params: LostItemSearchParams) =>
    queryOptions({
      queryKey: articleQueryKeys.lostItemSearch(params),
      queryFn: () => getLostItemSearch(params),
    }),

  lostItemStat: () =>
    queryOptions({
      queryKey: articleQueryKeys.lostItemStat,
      queryFn: getLostItemStat,
    }),

  lostItemChatroomList: (isLoggedIn: boolean) =>
    queryOptions({
      queryKey: articleQueryKeys.lostItemChatroomList(isLoggedIn),
      queryFn: () => getLostItemChatroomList(),
    }),

  lostItemChatroomDetail: (isLoggedIn: boolean, articleId: number, chatroomId: number) =>
    queryOptions({
      queryKey: articleQueryKeys.lostItemChatroomDetail(articleId, chatroomId, isLoggedIn),
      queryFn: () => getLostItemChatroomDetail(articleId, chatroomId),
    }),

  lostItemChatroomMessages: (isLoggedIn: boolean, articleId: number, chatroomId: number) =>
    queryOptions({
      queryKey: articleQueryKeys.lostItemChatroomMessages(articleId, chatroomId, isLoggedIn),
      queryFn: () => getLostItemChatroomMessagesV2(articleId, chatroomId),
    }),
};
