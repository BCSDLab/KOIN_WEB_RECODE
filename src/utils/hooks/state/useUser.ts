import { useSuspenseQuery } from '@tanstack/react-query';
import { getGeneralUser, getUser } from 'api/auth';
import { GeneralUserResponse, UserResponse } from 'api/auth/entity';
import { UserType, useTokenStore } from 'utils/zustand/auth';

export type UnionUserResponse = UserResponse | GeneralUserResponse;

const getUserInfo = async (token: string, userType: UserType): Promise<UnionUserResponse> => {
  if (userType === 'STUDENT') {
    return getUser(token);
  }
  return getGeneralUser(token);
};

export const useUser = () => {
  const { token, userType } = useTokenStore();
  const { data, isError } = useSuspenseQuery({
    queryKey: ['userInfo', token, userType],
    queryFn: () => {
      if (!token) return null;
      return getUserInfo(token, userType);
    },
  });

  return {
    data: isError ? null : data,
  };
};
