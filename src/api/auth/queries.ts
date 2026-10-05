import { isKoinError } from '@bcsdlab/koin';
import { queryOptions } from '@tanstack/react-query';
import fetchSession from 'utils/auth/fetchSession';
import { SESSION_QUERY_KEY, type Session } from 'utils/auth/session';
import { getViewerScope } from 'utils/ts/getViewerScope';

import type { UserAcademicInfoResponse, UserProfileResponse } from './entity';
import { getUserAcademicInfo, getUserProfile } from './index';

export const authQueryKeys = {
  all: ['auth'] as const,
  session: () => SESSION_QUERY_KEY,
  userInfo: (isLoggedIn: boolean) => [...authQueryKeys.all, 'user-info', getViewerScope(isLoggedIn)] as const,
  userAcademicInfo: (isLoggedIn: boolean) =>
    [...authQueryKeys.all, 'user-academic-info', getViewerScope(isLoggedIn)] as const,
};

export const SESSION_STALE_TIME = 5 * 60 * 1000;

const isUnauthorized = (error: unknown) => isKoinError(error) && error.status === 401;

export const authQueries = {
  session: () =>
    queryOptions<Session>({
      queryKey: authQueryKeys.session(),
      staleTime: SESSION_STALE_TIME,
      queryFn: fetchSession,
    }),

  // 401이면 진행 중에 세션이 끝난 것이다(apiClient가 세션을 anonymous로 바꿨다). 에러 대신 비로그인 값을 준다.
  userInfo: (isLoggedIn: boolean) =>
    queryOptions<UserProfileResponse | null>({
      queryKey: authQueryKeys.userInfo(isLoggedIn),
      queryFn: async () => {
        if (!isLoggedIn) return null;

        try {
          return await getUserProfile();
        } catch (error) {
          if (isUnauthorized(error)) return null;
          throw error;
        }
      },
    }),

  userAcademicInfo: (isLoggedIn: boolean) =>
    queryOptions<UserAcademicInfoResponse | null>({
      queryKey: authQueryKeys.userAcademicInfo(isLoggedIn),
      queryFn: () => (isLoggedIn ? getUserAcademicInfo() : null),
    }),
};
