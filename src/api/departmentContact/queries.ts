import { queryOptions } from '@tanstack/react-query';
import { DepartmentCategoryContactsRequest, DepartmentContactCategory, DepartmentContactsRequest } from './entity';
import { getDepartmentContacts, getDepartmentContactsByCategory } from './index';

export const departmentContactQueryKeys = {
  all: ['departmentContact'] as const,
  listRoot: ['departmentContact', 'list'] as const,
  list: (params: DepartmentContactsRequest) => [...departmentContactQueryKeys.listRoot, params] as const,
  byCategoryRoot: ['departmentContact', 'byCategory'] as const,
  byCategory: (category: DepartmentContactCategory, params: DepartmentCategoryContactsRequest) =>
    [...departmentContactQueryKeys.byCategoryRoot, category, params] as const,
};

export const departmentContactQueries = {
  list: (params: DepartmentContactsRequest = {}) =>
    queryOptions({
      queryKey: departmentContactQueryKeys.list(params),
      queryFn: () => getDepartmentContacts(params),
    }),

  byCategory: (category: DepartmentContactCategory, params: DepartmentCategoryContactsRequest = {}) =>
    queryOptions({
      queryKey: departmentContactQueryKeys.byCategory(category, params),
      queryFn: () => getDepartmentContactsByCategory(category, params),
    }),
};
