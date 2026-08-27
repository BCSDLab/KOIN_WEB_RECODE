import { queryOptions } from '@tanstack/react-query';

import type { TeamRecruitmentListRequest } from './entity';
import { getTeamRecruitmentList } from './index';

type TeamViewerScope = 'guest' | 'auth';

const getViewerScope = (token?: string | null): TeamViewerScope => (token ? 'auth' : 'guest');

export const teamQueryKeys = {
  all: ['team'] as const,

  listRoot: ['team', 'list'] as const,

  list: (params: TeamRecruitmentListRequest, token?: string | null) =>
    [...teamQueryKeys.listRoot, getViewerScope(token), params] as const,
};

export const teamQueries = {
  list: (params: TeamRecruitmentListRequest = {}, token?: string | null) =>
    queryOptions({
      queryKey: teamQueryKeys.list(params, token),
      queryFn: () => getTeamRecruitmentList(token || undefined, params),
    }),
};
