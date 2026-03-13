import { queryOptions } from '@tanstack/react-query';
import { getStoreReview } from './index';

export const reviewQueryKeys = {
  all: ['review'] as const,
  detail: (shopId: string, reviewId: string) => [...reviewQueryKeys.all, Number(shopId), reviewId] as const,
};

export const reviewQueries = {
  detail: (token: string, shopId: string, reviewId: string) =>
    queryOptions({
      queryKey: reviewQueryKeys.detail(shopId, reviewId),
      queryFn: () => getStoreReview(token, shopId, reviewId),
    }),
};
