import { isKoinError } from '@bcsdlab/koin';
import { queryOptions } from '@tanstack/react-query';

import type { GeneralUserResponse, UserAcademicInfoResponse, UserResponse } from './entity';
import { getGeneralUser, getUser, getUserAcademicInfo } from './index';

// 로그인 전에는 프론트가 회원 유형을 알 수 없어 빈 문자열이 들어올 수 있다 — 이 경우
// queryFn이 token 부재로 먼저 null을 반환하므로 getUserInfo까지 도달하지 않는다.
type AuthUserType = 'STUDENT' | 'GENERAL' | '';
type AuthUserInfoResponse = UserResponse | GeneralUserResponse;

const getUserInfo = (token: string, userType: AuthUserType): Promise<AuthUserInfoResponse> => {
  if (userType === 'STUDENT') {
    return getUser(token);
  }

  return getGeneralUser(token);
};

export const authQueryKeys = {
  all: ['auth'] as const,
  userInfo: (token: string, userType: AuthUserType) => [...authQueryKeys.all, 'user-info', token, userType] as const,
  userAcademicInfo: (token: string) => [...authQueryKeys.all, 'user-academic-info', token] as const,
};

export const authQueries = {
  userInfo: (token: string, userType: AuthUserType) =>
    queryOptions<AuthUserInfoResponse | null>({
      queryKey: authQueryKeys.userInfo(token, userType),
      queryFn: async () => {
        if (!token) return null;

        try {
          return await getUserInfo(token, userType);
        } catch (error) {
          if (isKoinError(error) && (error.status === 401 || error.status === 403)) {
            return null;
          }
          throw error;
        }
      },
    }),

  userAcademicInfo: (token: string) =>
    queryOptions<UserAcademicInfoResponse | null>({
      queryKey: authQueryKeys.userAcademicInfo(token),
      queryFn: () => (token ? getUserAcademicInfo(token) : null),
    }),
};
