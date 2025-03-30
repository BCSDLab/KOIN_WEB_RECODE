import { useSuspenseQuery } from '@tanstack/react-query';
import { banner } from 'api';

const useBanners = (categoryId: number) => {
  const { data: banners } = useSuspenseQuery(
    {
      queryKey: ['banners', `banner-${categoryId}`],
      queryFn: () => banner.getBanners(Number(categoryId)),
    },
  );
  return { banners };
};

export default useBanners;
