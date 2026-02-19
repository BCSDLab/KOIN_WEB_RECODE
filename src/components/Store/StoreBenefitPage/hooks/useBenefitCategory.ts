import { useSuspenseQuery } from '@tanstack/react-query';
import { getStoreBenefitCategory } from 'api/store';

const useBenefitCategory = () => {
  return useSuspenseQuery({
    queryKey: ['benefitCategory'],
    queryFn: getStoreBenefitCategory,
    select: (data) => data.benefits,
  });
};

export default useBenefitCategory;
