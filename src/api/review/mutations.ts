import { mutationOptions, QueryClient } from '@tanstack/react-query';
import { storeQueryKeys } from 'api/store/queries';
import { ReviewRequest } from './entity';
import { postStoreReview, putStoreReview } from './index';

interface ReviewMutationCallbacks {
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

export const reviewMutations = {
  add: (queryClient: QueryClient, token: string, shopId: string, callbacks: ReviewMutationCallbacks = {}) =>
    mutationOptions({
      mutationFn: (reviewData: ReviewRequest) => postStoreReview(token, shopId, reviewData),
      onSuccess: async () => {
        await invalidateStoreReviewQueries(queryClient, shopId);
        await callbacks.onSuccess?.();
      },
    }),

  edit: (
    queryClient: QueryClient,
    token: string,
    shopId: string,
    reviewId: string,
    callbacks: ReviewMutationCallbacks = {},
  ) =>
    mutationOptions({
      mutationFn: (reviewData: ReviewRequest) => putStoreReview(token, shopId, reviewId, reviewData),
      onSuccess: async () => {
        await invalidateStoreReviewQueries(queryClient, shopId);
        await callbacks.onSuccess?.();
      },
    }),
};
