import { isKoinError } from '@bcsdlab/koin';
import { queryOptions } from '@tanstack/react-query';
import { getViewerScope } from 'utils/ts/getViewerScope';
import type { UserType } from 'utils/zustand/auth';

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
  userInfo: (isLoggedIn: boolean, userType: UserType | null) =>
    [...authQueryKeys.all, 'user-info', getViewerScope(isLoggedIn), userType] as const,
  userAcademicInfo: (isLoggedIn: boolean) =>
    [...authQueryKeys.all, 'user-academic-info', getViewerScope(isLoggedIn)] as const,
};

export const authQueries = {
  userInfo: (isLoggedIn: boolean, userType: UserType | null) =>
    queryOptions<AuthUserInfoResponse | null>({
      queryKey: authQueryKeys.userInfo(isLoggedIn, userType),
      queryFn: async () => {
        if (!isLoggedIn) return null;

        try {
          return await getUserInfo(userType);
        } catch (error) {
          if (isKoinError(error) && (error.status === 401 || error.status === 403)) {
            return null;
          }
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
