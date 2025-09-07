import { useSuspenseQuery } from '@tanstack/react-query';
import { coopshop } from 'api';

const useCoopSemester = () => useSuspenseQuery({
  queryKey: ['coopSemester'],
  queryFn: async () => coopshop.getAllShopInfo(),
});

export default useCoopSemester;
