import { useSuspenseQuery } from '@tanstack/react-query';
import { coopshop } from 'api';

function useCampusInfo() {
  const { data: campusInfo } = useSuspenseQuery({
    queryKey: ['/coopshop'],
    queryFn: async () => coopshop.getAllShopInfo(),
  });

  return { campusInfo };
}

export default useCampusInfo;
