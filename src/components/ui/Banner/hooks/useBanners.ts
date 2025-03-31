import { useSuspenseQuery } from '@tanstack/react-query';
import { banner } from 'api';

const useBanners = (categoryId: number) => {
  const { data: bannersInfos } = useSuspenseQuery(
    {
      queryKey: ['banners', `banner-${categoryId}`],
      queryFn: () => banner.getBanners(Number(categoryId)),
    },
  );
  return { bannersInfos };
};

export default useBanners;
