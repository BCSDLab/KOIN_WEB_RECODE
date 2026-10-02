import { isKoinError } from '@bcsdlab/koin';
import { queryOptions } from '@tanstack/react-query';
import fetchSession from 'utils/auth/fetchSession';
import { SESSION_QUERY_KEY, type Session } from 'utils/auth/session';
import { getViewerScope } from 'utils/ts/getViewerScope';

import type { GeneralUserResponse, UserAcademicInfoResponse, UserProfileResponse, UserResponse } from './entity';
import { getUserAcademicInfo, getUserProfile } from './index';

type AuthUserInfoResponse = UserResponse | GeneralUserResponse;

// 서버는 회원 유형과 무관한 하나의 응답을 주지만, 소비 쪽은 학생/일반을 구분하는 타입을 쓴다.
// 학번이 있으면(학생·총학생회) 학생 정보로 본다.
const toUserInfo = (profile: UserProfileResponse): AuthUserInfoResponse => {
  const { student_number: studentNumber, major, anonymous_nickname: anonymousNickname, ...common } = profile;
  if (studentNumber === null) {
    return { ...common, user_type: 'GENERAL', anonymous_nickname: anonymousNickname ?? undefined };
  }

  return {
    ...common,
    user_type: 'STUDENT',
    student_number: studentNumber,
    major: major ?? '',
    anonymous_nickname: anonymousNickname ?? '',
  };
};

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

  // 로그인 상태에서만 요청한다. 비로그인은 세션이 정한다. 요청이 401이면 진행 중에 세션이 끝난 것이므로
  // apiClient가 세션을 anonymous로 뒤집었고 키가 곧 바뀐다 — 그 사이 에러 대신 비로그인 값을 준다.
  userInfo: (isLoggedIn: boolean) =>
    queryOptions<AuthUserInfoResponse | null>({
      queryKey: authQueryKeys.userInfo(isLoggedIn),
      queryFn: async () => {
        if (!isLoggedIn) return null;

        try {
          return toUserInfo(await getUserProfile());
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
