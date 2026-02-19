import { useSuspenseQuery } from '@tanstack/react-query';
import { getAllShopInfo } from 'api/coopshop';

const useCoopSemester = () =>
  useSuspenseQuery({
    queryKey: ['coopSemester'],
    queryFn: async () => getAllShopInfo(),
  });

export default useCoopSemester;
