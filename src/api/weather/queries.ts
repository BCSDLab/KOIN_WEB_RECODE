import { queryOptions } from '@tanstack/react-query';
import { getWeatherInfo } from './index';

export const weatherQueryKeys = {
  all: ['weather'] as const,
  info: () => [...weatherQueryKeys.all, 'info'] as const,
};

export const weatherQueries = {
  info: () =>
    queryOptions({
      queryKey: weatherQueryKeys.info(),
      queryFn: getWeatherInfo,
    }),
};
