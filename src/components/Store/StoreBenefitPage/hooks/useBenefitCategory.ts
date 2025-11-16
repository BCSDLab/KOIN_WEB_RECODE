import { useSuspenseQuery } from '@tanstack/react-query';
import * as api from 'api';

const useBenefitCategory = () => {
  return useSuspenseQuery({
    queryKey: ['benefitCategory'],
    queryFn: api.store.getStoreBenefitCategory,
    select: (data) => data.benefits,
  });
};

export default useBenefitCategory;
