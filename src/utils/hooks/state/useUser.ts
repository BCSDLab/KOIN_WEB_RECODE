import { useSuspenseQuery } from '@tanstack/react-query';
import type { GeneralUserResponse, UserResponse } from 'api/auth/entity';
import { authQueries } from 'api/auth/queries';
import { useServerRequest } from 'utils/context/serverRequest';
import { useTokenStore } from 'utils/zustand/auth';

type GeneralUserWithAnonymousNickname = GeneralUserResponse & {
  anonymous_nickname: string;
};

export type UnionUserResponse = UserResponse | GeneralUserWithAnonymousNickname;

// serverRequest.userType은 쿠키 원문(임의 문자열)이라 STUDENT/GENERAL로 좁혀서 넘겨야 한다.
// 알 수 없는 값은 ''로 취급한다 — authQueries.userInfo의 queryFn이 token 부재 시 먼저
// null을 반환하므로, 로그인 전 이 값이 ''인 것은 정상 동작이다.
const toKnownUserType = (value: string | null | undefined): 'STUDENT' | 'GENERAL' | '' =>
  value === 'STUDENT' || value === 'GENERAL' ? value : '';

export const useUser = () => {
  const { token, userType } = useTokenStore();
  const serverRequest = useServerRequest();
  // useTokenStore는 SSR에서 ''을 반환한다. 토큰이 쿼리 키에 들어가므로 서버 토큰으로
  // 폴백하지 않으면 서버와 클라이언트가 서로 다른 캐시를 본다.
  const effectiveToken = token || serverRequest?.token || '';
  const effectiveUserType = toKnownUserType(userType || serverRequest?.userType);

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
