import { queryOptions } from '@tanstack/react-query';
import { getBannerCategoryList, getBanners } from './index';

export const bannerQueryKeys = {
  all: ['banner'] as const,
  categories: () => [...bannerQueryKeys.all, 'categories'] as const,
  list: (categoryId: number) => [...bannerQueryKeys.all, 'list', categoryId] as const,
};

export const bannerQueries = {
  categories: () =>
    queryOptions({
      queryKey: bannerQueryKeys.categories(),
      queryFn: getBannerCategoryList,
    }),

  list: (categoryId: number) =>
    queryOptions({
      queryKey: bannerQueryKeys.list(categoryId),
      queryFn: () => getBanners(categoryId),
    }),
};
