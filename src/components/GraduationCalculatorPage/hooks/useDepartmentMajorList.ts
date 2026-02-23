import { useSuspenseQuery } from '@tanstack/react-query';
import { getDeptMajorList } from 'api/dept';

export default function useDepartmentMajorList() {
  const { data } = useSuspenseQuery({
    queryKey: ['deptMajor'],
    queryFn: getDeptMajorList,
  });

  return { data };
}
