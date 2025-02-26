import { useSuspenseQuery } from '@tanstack/react-query';
import { dept } from 'api';

export default function useDepartmentMajorList() {
  const { data } = useSuspenseQuery({
    queryKey: ['deptMajor'],
    queryFn: dept.getDeptMajorList,
  });

  return { data };
}
