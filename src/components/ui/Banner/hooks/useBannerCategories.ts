import { useSuspenseQuery } from '@tanstack/react-query';
import { getBannerCategoryList } from 'api/banner';

const useBannerCategories = () => {
  const { data } = useSuspenseQuery(
    {
      queryKey: ['bannerCategory'],
      queryFn: () => getBannerCategoryList(),
    },
  );

  return data.banner_categories;
};

export default useBannerCategories;
