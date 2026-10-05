import { mutationOptions, type QueryClient } from '@tanstack/react-query';

import type {
  LostItemArticlesRequestDTO,
  ReportItemArticleRequestDTO,
  UpdateLostItemArticleRequestDTO,
} from './entity';
import {
  deleteLostItemArticle,
  postBlockLostItemChatroom,
  postFoundLostItem,
  postLostItemArticle,
  postLostItemChatroom,
  postReportLostItemArticle,
  putLostItemArticle,
} from './index';
import { articleQueryKeys } from './queries';

const invalidateLostItemAll = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: articleQueryKeys.lostItemAll });

const invalidateLostItemChatroomAll = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: articleQueryKeys.lostItemChatroomAll });

export const articleMutations = {
  createLostItem: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: async (data: LostItemArticlesRequestDTO) => {
        const response = await postLostItemArticle(data);

        return response.id;
      },
      onSuccess: () => invalidateLostItemAll(queryClient),
    }),

  updateLostItem: (queryClient: QueryClient, articleId: number) =>
    mutationOptions({
      mutationFn: async (data: UpdateLostItemArticleRequestDTO) => {
        const response = await putLostItemArticle(articleId, data);

        return response.id;
      },
      onSuccess: () => invalidateLostItemAll(queryClient),
    }),

  deleteLostItem: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (articleId: number) => deleteLostItemArticle(articleId),
      onSuccess: () => invalidateLostItemAll(queryClient),
    }),

  reportLostItem: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: ({ articleId, reports }: { articleId: number; reports: ReportItemArticleRequestDTO['reports'] }) =>
        postReportLostItemArticle(articleId, { reports }),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: articleQueryKeys.all });
        await invalidateLostItemAll(queryClient);
      },
    }),

  toggleLostItemFound: (queryClient: QueryClient, isLoggedIn: boolean, articleId: number) =>
    mutationOptions({
      mutationFn: () => postFoundLostItem(articleId),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: articleQueryKeys.lostItemDetail(articleId, isLoggedIn) }),
    }),

  createLostItemChatroom: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (articleId: number) => postLostItemChatroom(articleId),
      onSuccess: () => invalidateLostItemChatroomAll(queryClient),
    }),

  blockLostItemChatroom: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: ({ articleId, chatroomId }: { articleId: number; chatroomId: number }) =>
        postBlockLostItemChatroom(articleId, chatroomId),
      onSuccess: () => invalidateLostItemChatroomAll(queryClient),
    }),
};
