import { useSuspenseQuery } from '@tanstack/react-query';
import * as api from 'api';

const useStoreBenefitList = (id: string) => {
  return useSuspenseQuery({
    queryKey: ['storeBenefit', id],
    queryFn: async ({ queryKey }) => {
      const queryFnParams = queryKey[1];

      return api.store.getStoreBenefitList(queryFnParams);
    },
    select: (data) => {
      return {
        storeBenefitList: data.shops,
        count: data.count,
      };
    },
  });
};

export default useStoreBenefitList;
