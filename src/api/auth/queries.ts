import { isKoinError } from '@bcsdlab/koin';
import { queryOptions } from '@tanstack/react-query';
import type { UserType } from 'utils/zustand/auth';

import type { GeneralUserResponse, UserAcademicInfoResponse, UserResponse } from './entity';
import { getGeneralUser, getUser, getUserAcademicInfo } from './index';

type AuthUserInfoResponse = UserResponse | GeneralUserResponse;

// userType이 null(로그인 전, 아직 알 수 없음)이면 queryFn이 token 부재로 먼저 null을
// 반환하므로 이 분기까지 도달하지 않는다 — null을 GENERAL과 동일하게 취급해도 안전하다.
const getUserInfo = (token: string, userType: UserType | null): Promise<AuthUserInfoResponse> => {
  if (userType === 'STUDENT') {
    return getUser(token);
  }

  return getGeneralUser(token);
};

export const authQueryKeys = {
  all: ['auth'] as const,
  userInfo: (token: string, userType: UserType | null) => [...authQueryKeys.all, 'user-info', token, userType] as const,
  userAcademicInfo: (token: string) => [...authQueryKeys.all, 'user-academic-info', token] as const,
};

export const authQueries = {
  userInfo: (token: string, userType: UserType | null) =>
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
