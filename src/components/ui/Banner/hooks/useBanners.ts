import { useSuspenseQuery } from '@tanstack/react-query';
import { banner } from 'api';

const useBanners = (categoryId: number) => {
  const { data: banners } = useSuspenseQuery(
    {
      queryKey: ['banners', categoryId],
      queryFn: async ({ queryKey }) => {
        const queryFnParams = queryKey[1];
        return banner.getBanners(queryFnParams as number);
      },
    },
  );
  return { banners };
};

export default useBanners;
