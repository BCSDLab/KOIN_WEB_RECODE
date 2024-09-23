import { useQuery } from '@tanstack/react-query';
import * as api from 'api';

const useBenefitCategory = () => {
  const { data: benefitCategory } = useQuery(
    {
      queryKey: ['benefitCategory'],
      queryFn: api.store.getStoreBenefitCategory,
    },
  );

  return {
    benefitCategory,
  };
};

export default useBenefitCategory;
