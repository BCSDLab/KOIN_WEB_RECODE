import { useSuspenseQuery } from '@tanstack/react-query';
import { dept } from 'api';

const useDeptList = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['dept'],
    queryFn: dept.getDeptList,
  });

  return { data };
};

export default useDeptList;
