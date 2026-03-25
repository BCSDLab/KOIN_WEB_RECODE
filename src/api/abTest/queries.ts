import { queryOptions } from '@tanstack/react-query';
import { ABTestAssignResponse } from './entity';
import { abTestAssign } from './index';

type DefaultABTestAssignResponse = ABTestAssignResponse | { access_history_id: null; variable_name: string };

const getDefaultABTestResponse = (): DefaultABTestAssignResponse => ({
  access_history_id: null,
  variable_name: 'default',
});

export const abTestQueryKeys = {
  all: ['ab-test'] as const,
  assign: (title: string, authorization?: string, accessHistoryId?: string | number | null) =>
    [...abTestQueryKeys.all, 'assign', title, authorization ?? '', accessHistoryId ?? ''] as const,
};

export const abTestQueries = {
  assign: (title: string, authorization?: string, accessHistoryId?: string | number | null) =>
    queryOptions<DefaultABTestAssignResponse>({
      queryKey: abTestQueryKeys.assign(title, authorization, accessHistoryId),
      queryFn: async () => {
        try {
          return await abTestAssign(title, authorization || undefined, accessHistoryId);
        } catch {
          return getDefaultABTestResponse();
        }
      },
    }),
};
