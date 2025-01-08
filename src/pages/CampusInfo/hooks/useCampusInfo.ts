import { coopshop } from 'api';
import { useSuspenseQuery } from '@tanstack/react-query';

function useCampusInfo() {
  const { data: campusInfo } = useSuspenseQuery({
    queryKey: ['/coopshop'],
    queryFn: async () => coopshop.getAllShopInfo(),
  });

  return { campusInfo };
}

export default useCampusInfo;
