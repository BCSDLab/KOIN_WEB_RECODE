import { useSuspenseQuery } from '@tanstack/react-query';
import { getAllShopInfo } from 'api/coopshop';

function useCampusInfo() {
  const { data: campusInfo } = useSuspenseQuery({
    queryKey: ['/coopshop'],
    queryFn: async () => getAllShopInfo(),
  });

  return { campusInfo };
}

export default useCampusInfo;
