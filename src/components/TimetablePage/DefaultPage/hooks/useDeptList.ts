import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { dept } from 'api';

const useDeptList = () => {
  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ['dept'],
      queryFn: dept.default,
    }),
  );
  return { data };
};

export default useDeptList;
