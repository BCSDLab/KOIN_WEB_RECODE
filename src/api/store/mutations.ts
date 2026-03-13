import { mutationOptions, QueryClient } from '@tanstack/react-query';
import { ReviewReportRequest } from './entity';
import { storeQueryKeys } from './queries';
import { deleteReview, postReviewReport } from './index';

interface StoreMutationCallbacks {
  onSuccess?: () => void | Promise<void>;
}

const invalidateStoreReviewQueries = async (queryClient: QueryClient, shopId: string) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: storeQueryKeys.reviews(Number(shopId)) }),
    queryClient.invalidateQueries({ queryKey: storeQueryKeys.myReviews(shopId) }),
    queryClient.invalidateQueries({ queryKey: storeQueryKeys.detail(shopId) }),
    queryClient.invalidateQueries({ queryKey: storeQueryKeys.detailPage(shopId) }),
  ]);
};

export const storeMutations = {
  deleteReview: (
    queryClient: QueryClient,
    reviewId: number,
    shopId: string,
    token: string,
    callbacks: StoreMutationCallbacks = {},
  ) =>
    mutationOptions({
      mutationFn: () => deleteReview(reviewId, shopId, token),
      onSuccess: async () => {
        await invalidateStoreReviewQueries(queryClient, shopId);
        await callbacks.onSuccess?.();
      },
    }),

  reportReview: (
    queryClient: QueryClient,
    shopId: string,
    reviewId: string,
    token: string,
    callbacks: StoreMutationCallbacks = {},
  ) =>
    mutationOptions({
      mutationFn: (data: ReviewReportRequest) => postReviewReport(Number(shopId), Number(reviewId), data, token),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: storeQueryKeys.reviews(Number(shopId)) });
        await callbacks.onSuccess?.();
      },
    }),
};
