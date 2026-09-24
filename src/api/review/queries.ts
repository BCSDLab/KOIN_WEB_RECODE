import { queryOptions } from '@tanstack/react-query';
import { getViewerScope } from 'utils/ts/getViewerScope';

import { getStoreReview } from './index';

export const reviewQueryKeys = {
  all: ['review'] as const,
  detail: (shopId: string, reviewId: string, isLoggedIn: boolean) =>
    [...reviewQueryKeys.all, Number(shopId), reviewId, getViewerScope(isLoggedIn)] as const,
};

export const reviewQueries = {
  detail: (shopId: string, reviewId: string, isLoggedIn: boolean) =>
    queryOptions({
      queryKey: reviewQueryKeys.detail(shopId, reviewId, isLoggedIn),
      queryFn: () => getStoreReview(shopId, reviewId),
    }),
};
