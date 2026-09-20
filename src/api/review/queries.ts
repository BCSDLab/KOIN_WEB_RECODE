import { queryOptions } from '@tanstack/react-query';
import { getViewerScope } from 'utils/ts/getViewerScope';

import { getStoreReview } from './index';

export const reviewQueryKeys = {
  all: ['review'] as const,
  detail: (shopId: string, reviewId: string, token?: string | null) =>
    [...reviewQueryKeys.all, Number(shopId), reviewId, getViewerScope(token)] as const,
};

export const reviewQueries = {
  detail: (token: string, shopId: string, reviewId: string) =>
    queryOptions({
      queryKey: reviewQueryKeys.detail(shopId, reviewId, token),
      queryFn: () => getStoreReview(token, shopId, reviewId),
    }),
};
