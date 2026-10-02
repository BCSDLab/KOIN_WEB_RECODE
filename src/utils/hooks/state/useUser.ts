import { useSuspenseQuery } from '@tanstack/react-query';
import type { GeneralUserResponse, UserResponse } from 'api/auth/entity';
import { authQueries } from 'api/auth/queries';
import useSession from 'utils/hooks/auth/useSession';

type GeneralUserWithAnonymousNickname = GeneralUserResponse & {
  anonymous_nickname: string;
};

export type UnionUserResponse = UserResponse | GeneralUserWithAnonymousNickname;

export const useUser = () => {
  const session = useSession();
  const isLoggedIn = session.status === 'authenticated';
  const userType = session.status === 'authenticated' ? session.userType : null;

  const { data } = useSuspenseQuery({
    ...authQueries.userInfo(isLoggedIn, userType),
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

  return { data };
};
