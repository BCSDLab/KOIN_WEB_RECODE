import { queryOptions } from '@tanstack/react-query';

import type { TeamRecruitmentListRequest, TeamRecruitmentNotificationListRequest } from './entity';
import { getTeamRecruitmentList, getTeamRecruitmentNotifications } from './index';

type TeamViewerScope = 'guest' | 'auth';

const getViewerScope = (token?: string | null): TeamViewerScope => (token ? 'auth' : 'guest');

export const teamQueryKeys = {
  all: ['team'] as const,

  listRoot: ['team', 'list'] as const,

  list: (params: TeamRecruitmentListRequest, token?: string | null) =>
    [...teamQueryKeys.listRoot, getViewerScope(token), params] as const,

  notificationsRoot: ['team', 'notifications'] as const,

  notifications: (token: string, params: TeamRecruitmentNotificationListRequest) =>
    [...teamQueryKeys.notificationsRoot, token, params] as const,
};

export const teamQueries = {
  list: (params: TeamRecruitmentListRequest = {}, token?: string | null) =>
    queryOptions({
      queryKey: teamQueryKeys.list(params, token),
      queryFn: () => getTeamRecruitmentList(token || undefined, params),
    }),

  notifications: (token: string, params: TeamRecruitmentNotificationListRequest = {}) =>
    queryOptions({
      queryKey: teamQueryKeys.notifications(token, params),
      queryFn: () => getTeamRecruitmentNotifications(token, params),
      staleTime: 60000,
    }),
};
