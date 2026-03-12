import { useSuspenseQuery } from '@tanstack/react-query';
import { GeneralUserResponse, UserResponse } from 'api/auth/entity';
import { authQueries } from 'api/auth/queries';
import { UserType, useTokenStore } from 'utils/zustand/auth';

type GeneralUserWithAnonymousNickname = GeneralUserResponse & {
  anonymous_nickname: string;
};

export type UnionUserResponse = UserResponse | GeneralUserWithAnonymousNickname;

export const useUser = () => {
  const { token, userType } = useTokenStore();
  const { data, isError } = useSuspenseQuery({
    ...authQueries.userInfo(token, userType as UserType),
    select: (rawData) => {
      if (!rawData) return null;

      if (rawData.user_type === 'STUDENT') {
        return rawData;
      }

      const timeStamp = Date.now();
      const anonymousNickname = `익명${rawData.id}${timeStamp.toString().slice(-4)}`;

      return {
        ...rawData,
        anonymous_nickname: anonymousNickname,
      };
    },
  });

  return {
    data: isError ? null : data,
  };
};
