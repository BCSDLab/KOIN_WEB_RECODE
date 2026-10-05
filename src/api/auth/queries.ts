import { queryOptions } from '@tanstack/react-query';
import { GeneralUserResponse, UserAcademicInfoResponse, UserResponse } from './entity';
import { getGeneralUser, getUser, getUserAcademicInfo } from './index';

type AuthUserType = 'STUDENT' | 'GENERAL';
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
      queryFn: () => (token ? getUserInfo(token, userType) : null),
    }),

  userAcademicInfo: (token: string) =>
    queryOptions<UserAcademicInfoResponse | null>({
      queryKey: authQueryKeys.userAcademicInfo(token),
      queryFn: () => (token ? getUserAcademicInfo(token) : null),
    }),
};
