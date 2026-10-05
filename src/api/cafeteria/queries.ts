import { queryOptions } from '@tanstack/react-query';
import { getCafeteriaDinings } from './index';

export const cafeteriaQueryKeys = {
  all: ['cafeteria'] as const,
  dinings: (date: string) => [...cafeteriaQueryKeys.all, 'dinings', date] as const,
};

export const cafeteriaQueries = {
  dinings: (date: string) =>
    queryOptions({
      queryKey: cafeteriaQueryKeys.dinings(date),
      queryFn: () => getCafeteriaDinings(date),
    }),
};
