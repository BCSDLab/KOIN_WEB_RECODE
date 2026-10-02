import { isKoinError } from '@bcsdlab/koin';
import { queryOptions } from '@tanstack/react-query';
import fetchSession from 'utils/auth/fetchSession';
import { SESSION_QUERY_KEY, type Session, type UserType } from 'utils/auth/session';
import { getViewerScope } from 'utils/ts/getViewerScope';

import type { GeneralUserResponse, UserAcademicInfoResponse, UserResponse } from './entity';
import { getGeneralUser, getUser, getUserAcademicInfo } from './index';

type AuthUserInfoResponse = UserResponse | GeneralUserResponse;

const getUserInfo = (userType: UserType | null): Promise<AuthUserInfoResponse> => {
  if (userType === 'STUDENT') {
    return getUser();
  }

  return getGeneralUser();
};

export const authQueryKeys = {
  all: ['auth'] as const,
  session: () => SESSION_QUERY_KEY,
  userInfo: (isLoggedIn: boolean, userType: UserType | null) =>
    [...authQueryKeys.all, 'user-info', getViewerScope(isLoggedIn), userType] as const,
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

  // 로그인 상태에서만 요청한다. 비로그인은 세션이 정한다. 요청이 401이면 진행 중에 세션이 끝난 것이므로
  // apiClient가 세션을 anonymous로 뒤집었고 키가 곧 바뀐다 — 그 사이 에러 대신 비로그인 값을 준다.
  userInfo: (isLoggedIn: boolean, userType: UserType | null) =>
    queryOptions<AuthUserInfoResponse | null>({
      queryKey: authQueryKeys.userInfo(isLoggedIn, userType),
      queryFn: async () => {
        if (!isLoggedIn) return null;

        try {
          return await getUserInfo(userType);
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
