import { useSuspenseQuery } from '@tanstack/react-query';
import { getBanners } from 'api/banner';

const useBanners = (categoryId: number) => {
  const { data } = useSuspenseQuery({
    queryKey: ['banners', categoryId],
    queryFn: () => getBanners(categoryId),
  });
  return { data };
};

export default useBanners;
