import { useQuery } from '@tanstack/react-query';
import * as api from 'api';

const useStoreBenefitList = (id: string) => {
  const { data: storeBenefitList } = useQuery(
    {
      queryKey: ['storeBenefit', id],
      queryFn: async ({ queryKey }) => {
        const queryFnParams = queryKey[1];

        return api.store.getStoreBenefitList(queryFnParams);
      },
    },
  );

  return {
    count: storeBenefitList?.count,
    storeBenefitList: storeBenefitList?.shops,
  };
};

export default useStoreBenefitList;
