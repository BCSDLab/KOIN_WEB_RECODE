import { mutationOptions, QueryClient } from '@tanstack/react-query';
import {
  LostItemArticlesRequestDTO,
  ReportItemArticleRequestDTO,
  UpdateLostItemArticleRequestDTO,
} from './entity';
import { articleQueryKeys } from './queries';
import {
  deleteLostItemArticle,
  postBlockLostItemChatroom,
  postFoundLostItem,
  postLostItemArticle,
  postLostItemChatroom,
  postReportLostItemArticle,
  putLostItemArticle,
} from './index';

const invalidateLostItemAll = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: articleQueryKeys.lostItemAll });

const invalidateLostItemChatroomAll = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: articleQueryKeys.lostItemChatroomAll });

export const articleMutations = {
  createLostItem: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: async (data: LostItemArticlesRequestDTO) => {
        const response = await postLostItemArticle(token, data);
        return response.id;
      },
      onSuccess: () => invalidateLostItemAll(queryClient),
    }),

  updateLostItem: (queryClient: QueryClient, token: string, articleId: number) =>
    mutationOptions({
      mutationFn: async (data: UpdateLostItemArticleRequestDTO) => {
        const response = await putLostItemArticle(token, articleId, data);
        return response.id;
      },
      onSuccess: () => invalidateLostItemAll(queryClient),
    }),

  deleteLostItem: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: (articleId: number) => deleteLostItemArticle(token, articleId),
      onSuccess: () => invalidateLostItemAll(queryClient),
    }),

  reportLostItem: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: ({ articleId, reports }: { articleId: number; reports: ReportItemArticleRequestDTO['reports'] }) =>
        postReportLostItemArticle(token, articleId, { reports }),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: articleQueryKeys.all });
        await invalidateLostItemAll(queryClient);
      },
    }),

  toggleLostItemFound: (queryClient: QueryClient, token: string, articleId: number) =>
    mutationOptions({
      mutationFn: () => postFoundLostItem(token, articleId),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: articleQueryKeys.lostItemDetail(articleId) }),
    }),

  createLostItemChatroom: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: (articleId: number) => postLostItemChatroom(token, articleId),
      onSuccess: () => invalidateLostItemChatroomAll(queryClient),
    }),

  blockLostItemChatroom: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: ({ articleId, chatroomId }: { articleId: number; chatroomId: number }) =>
        postBlockLostItemChatroom(token, articleId, chatroomId),
      onSuccess: () => invalidateLostItemChatroomAll(queryClient),
    }),
};
