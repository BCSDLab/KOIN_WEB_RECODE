import { useSuspenseQuery } from '@tanstack/react-query';
import type { GeneralUserResponse, UserResponse } from 'api/auth/entity';
import { authQueries } from 'api/auth/queries';
import { useServerRequest } from 'utils/context/serverRequest';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';
import { useTokenStore } from 'utils/zustand/auth';

type GeneralUserWithAnonymousNickname = GeneralUserResponse & {
  anonymous_nickname: string;
};

export type UnionUserResponse = UserResponse | GeneralUserWithAnonymousNickname;

export const useUser = () => {
  const { userType } = useTokenStore();
  const serverRequest = useServerRequest();
  const isLoggedIn = useIsLoggedIn();
  const effectiveUserType = userType || serverRequest?.userType || null;

  const { data, isError } = useSuspenseQuery({
    ...authQueries.userInfo(isLoggedIn, effectiveUserType),
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
