import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import type { TeamRecruitmentListRequest, TeamRecruitmentNotificationListRequest } from './entity';
import { getTeamRecruitmentList, getTeamRecruitmentNotifications } from './index';

const TEAM_LIST_LIMIT = 10;
const TEAM_NOTIFICATION_LIMIT = 10;

type TeamViewerScope = 'guest' | 'auth';

const getViewerScope = (token?: string | null): TeamViewerScope => (token ? 'auth' : 'guest');

export type TeamRecruitmentInfiniteListRequest = Omit<TeamRecruitmentListRequest, 'page' | 'limit'>;

export const teamQueryKeys = {
  all: ['team'] as const,

  listRoot: ['team', 'list'] as const,

  infiniteList: (params: TeamRecruitmentInfiniteListRequest, token?: string | null) =>
    [...teamQueryKeys.listRoot, 'infinite', getViewerScope(token), params] as const,

  notificationsRoot: ['team', 'notifications'] as const,

  notifications: (token: string, params: TeamRecruitmentNotificationListRequest) =>
    [...teamQueryKeys.notificationsRoot, token, params] as const,

  infiniteNotifications: (token: string) => [...teamQueryKeys.notificationsRoot, 'infinite', token] as const,
};

export const teamQueries = {
  infiniteList: (params: TeamRecruitmentInfiniteListRequest = {}, token?: string | null) =>
    infiniteQueryOptions({
      queryKey: teamQueryKeys.infiniteList(params, token),
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        getTeamRecruitmentList(token || undefined, { ...params, page: pageParam, limit: TEAM_LIST_LIMIT }),
      getNextPageParam: (lastPage) => {
        if (lastPage.current_page < lastPage.total_page) {
          return lastPage.current_page + 1;
        }

        return undefined;
      },
    }),

  notifications: (token: string, params: TeamRecruitmentNotificationListRequest = {}) =>
    queryOptions({
      queryKey: teamQueryKeys.notifications(token, params),
      queryFn: () => getTeamRecruitmentNotifications(token, params),
      staleTime: 60000,
    }),

  infiniteNotifications: (token: string) =>
    infiniteQueryOptions({
      queryKey: teamQueryKeys.infiniteNotifications(token),
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        getTeamRecruitmentNotifications(token, { page: pageParam, limit: TEAM_NOTIFICATION_LIMIT }),
      getNextPageParam: (lastPage) => {
        if (lastPage.current_page < lastPage.total_page) {
          return lastPage.current_page + 1;
        }

        return undefined;
      },
      staleTime: 60000,
    }),
};
