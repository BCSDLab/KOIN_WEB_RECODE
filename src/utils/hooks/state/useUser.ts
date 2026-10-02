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

      const timeStamp = Date.now();

      return { ...profile, anonymous_nickname: `익명${profile.id}${timeStamp.toString().slice(-4)}` };
    },
  });

  return { data };
};
