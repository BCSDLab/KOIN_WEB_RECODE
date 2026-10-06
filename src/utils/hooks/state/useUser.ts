import { useSuspenseQuery } from '@tanstack/react-query';
import type { UserInfo } from 'api/auth/entity';
import { authQueries } from 'api/auth/queries';
import useSession from 'utils/hooks/auth/useSession';

export const useUser = () => {
  const isLoggedIn = useSession().status === 'authenticated';

  const { data } = useSuspenseQuery({
    ...authQueries.userInfo(isLoggedIn),
    select: (profile): UserInfo | null => {
      if (!profile) return null;
      if (profile.anonymous_nickname) return { ...profile, anonymous_nickname: profile.anonymous_nickname };

      // select는 렌더마다 다시 실행되고 SSR과 하이드레이션 값이 같아야 하므로 프로필에서만 파생한다.
      return { ...profile, anonymous_nickname: `익명${profile.id}` };
    },
  });

  return { data };
};
