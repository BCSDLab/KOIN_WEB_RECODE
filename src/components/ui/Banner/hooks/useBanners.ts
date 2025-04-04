import { useSuspenseQuery } from '@tanstack/react-query';
import { banner } from 'api';

const useBanners = (categoryId: number) => {
  const { data } = useSuspenseQuery(
    {
      queryKey: ['banners', categoryId],
      queryFn: () => banner.getBanners(categoryId),
    },
  );
  return { data };
};

export default useBanners;
