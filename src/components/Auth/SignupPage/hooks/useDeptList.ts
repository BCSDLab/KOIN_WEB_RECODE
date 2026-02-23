import { useSuspenseQuery } from '@tanstack/react-query';
import { getDeptList } from 'api/dept';

const useDeptList = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['dept'],
    queryFn: getDeptList,
  });

  return { data };
};

export default useDeptList;
