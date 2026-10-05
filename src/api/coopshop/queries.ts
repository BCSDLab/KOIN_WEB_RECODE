import { queryOptions } from '@tanstack/react-query';
import { getAllShopInfo, getCafeteriaInfo } from './index';

export const coopshopQueryKeys = {
  all: ['coopshop'] as const,
  allShopInfo: () => [...coopshopQueryKeys.all, 'all-shop-info'] as const,
  cafeteriaInfo: () => [...coopshopQueryKeys.all, 'cafeteria-info'] as const,
};

export const coopshopQueries = {
  allShopInfo: () =>
    queryOptions({
      queryKey: coopshopQueryKeys.allShopInfo(),
      queryFn: getAllShopInfo,
    }),

  cafeteriaInfo: () =>
    queryOptions({
      queryKey: coopshopQueryKeys.cafeteriaInfo(),
      queryFn: getCafeteriaInfo,
    }),
};
