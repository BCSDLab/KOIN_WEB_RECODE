import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { LostItemArticlesRequest, SearchLostItemArticleRequest } from './entity';
import {
  getArticle,
  getArticles,
  getLostItemChatroomDetail,
  getLostItemChatroomList,
  getLostItemChatroomMessagesV2,
  getHotArticles,
  getLostItemArticles,
  getLostItemSearch,
  getLostItemStat,
  getSingleLostItemArticle,
} from './index';

type LostItemInfiniteListParams = Omit<LostItemArticlesRequest, 'page'>;

type LostItemSearchParams = Required<Pick<SearchLostItemArticleRequest, 'query'>> & {
  page: number;
  limit: number;
};

export const articleQueryKeys = {
  all: ['articles'] as const,
  listRoot: ['articles', 'list'] as const,
  list: (page: string) => [...articleQueryKeys.listRoot, page] as const,
  hot: ['articles', 'hot'] as const,
  detail: (id: string) => ['articles', 'detail', id] as const,
  lostItemAll: ['lostItem'] as const,
  lostItemListRoot: ['lostItem', 'list'] as const,
  lostItemList: (params: LostItemArticlesRequest) => [...articleQueryKeys.lostItemListRoot, params] as const,
  lostItemInfiniteListRoot: ['lostItem', 'infinite-list'] as const,
  lostItemInfiniteList: (params: LostItemInfiniteListParams) =>
    [...articleQueryKeys.lostItemInfiniteListRoot, params] as const,
  lostItemDetail: (articleId: number) => ['lostItem', 'detail', articleId] as const,
  lostItemSearch: (params: LostItemSearchParams) => ['lostItem', 'search', params] as const,
  lostItemStat: ['lostItem', 'stat'] as const,
  lostItemChatroomAll: ['chatroom', 'lost-item'] as const,
  lostItemChatroomList: ['chatroom', 'lost-item', 'list'] as const,
  lostItemChatroomDetail: (articleId: number | string | null, chatroomId: number | string | null) =>
    ['chatroom', 'lost-item', 'detail', articleId, chatroomId] as const,
  lostItemChatroomMessages: (articleId: number | string | null, chatroomId: number | string | null) =>
    ['chatroom', 'lost-item', 'messages', articleId, chatroomId] as const,
};

export const articleQueries = {
  list: (token: string, page: string) =>
    queryOptions({
      queryKey: articleQueryKeys.list(page),
      queryFn: () => getArticles(token, page),
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

  lostItemList: (token: string, params: LostItemArticlesRequest) =>
    queryOptions({
      queryKey: articleQueryKeys.lostItemList(params),
      queryFn: () => getLostItemArticles(token, params),
    }),

  lostItemInfiniteList: (token: string, params: LostItemInfiniteListParams) =>
    infiniteQueryOptions({
      queryKey: articleQueryKeys.lostItemInfiniteList(params),
      initialPageParam: 1,
      queryFn: ({ pageParam }) => getLostItemArticles(token, { ...params, page: pageParam }),
      getNextPageParam: (lastPage) => {
        if (lastPage.total_page > lastPage.current_page) {
          return lastPage.current_page + 1;
        }

        return undefined;
      },
    }),

  lostItemDetail: (token: string, articleId: number) =>
    queryOptions({
      queryKey: articleQueryKeys.lostItemDetail(articleId),
      queryFn: () => getSingleLostItemArticle(token, articleId),
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

  lostItemChatroomList: (token: string) =>
    queryOptions({
      queryKey: articleQueryKeys.lostItemChatroomList,
      queryFn: () => getLostItemChatroomList(token),
    }),

  lostItemChatroomDetail: (token: string, articleId: number, chatroomId: number) =>
    queryOptions({
      queryKey: articleQueryKeys.lostItemChatroomDetail(articleId, chatroomId),
      queryFn: () => getLostItemChatroomDetail(token, articleId, chatroomId),
    }),

  lostItemChatroomMessages: (token: string, articleId: number, chatroomId: number) =>
    queryOptions({
      queryKey: articleQueryKeys.lostItemChatroomMessages(articleId, chatroomId),
      queryFn: () => getLostItemChatroomMessagesV2(token, articleId, chatroomId),
    }),
};
