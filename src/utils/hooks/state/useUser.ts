import { useSuspenseQuery } from '@tanstack/react-query';
import { GeneralUserResponse, UserResponse } from 'api/auth/entity';
import { authQueries } from 'api/auth/queries';
import { useServerRequest } from 'utils/context/serverRequest';
import { UserType, useTokenStore } from 'utils/zustand/auth';

type GeneralUserWithAnonymousNickname = GeneralUserResponse & {
  anonymous_nickname: string;
};

export type UnionUserResponse = UserResponse | GeneralUserWithAnonymousNickname;

export const useUser = () => {
  const { token, userType } = useTokenStore();
  const serverRequest = useServerRequest();
  // useTokenStore는 SSR에서 ''을 반환한다. 토큰이 쿼리 키에 들어가므로 서버 토큰으로
  // 폴백하지 않으면 서버와 클라이언트가 서로 다른 캐시를 본다.
  const effectiveToken = token || serverRequest?.token || '';
  const effectiveUserType = (userType || serverRequest?.userType || '') as UserType;

  const { data, isError } = useSuspenseQuery({
    ...authQueries.userInfo(effectiveToken, effectiveUserType),
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
