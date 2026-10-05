import { queryOptions } from '@tanstack/react-query';
import { getDeptList, getDeptMajorList } from './index';

export const deptQueryKeys = {
  all: ['dept'] as const,
  list: () => [...deptQueryKeys.all, 'list'] as const,
  majorList: () => [...deptQueryKeys.all, 'major-list'] as const,
};

export const deptQueries = {
  list: () =>
    queryOptions({
      queryKey: deptQueryKeys.list(),
      queryFn: getDeptList,
    }),

  majorList: () =>
    queryOptions({
      queryKey: deptQueryKeys.majorList(),
      queryFn: getDeptMajorList,
    }),
};
