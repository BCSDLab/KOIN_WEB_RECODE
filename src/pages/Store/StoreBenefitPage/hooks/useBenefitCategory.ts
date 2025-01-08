import * as api from 'api';
import { useQuery } from '@tanstack/react-query';

const useBenefitCategory = () => {
  const { data: benefitCategory } = useQuery({
    queryKey: ['benefitCategory'],
    queryFn: api.store.getStoreBenefitCategory,
  });

  return {
    benefitCategory: benefitCategory?.benefits,
  };
};

export default useBenefitCategory;
