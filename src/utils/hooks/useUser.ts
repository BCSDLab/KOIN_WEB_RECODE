import { useSuspenseQuery } from '@tanstack/react-query';
import { getUser } from 'api/auth';
import { useTokenStore } from 'utils/zustand';

export const useUser = () => {
  const { token } = useTokenStore();
  const { data, isError } = useSuspenseQuery(
    // isIdle: 왜 필요한거죠..?
    {
      queryKey: ['userInfo', token],
      queryFn: () => (token ? getUser(token) : null),
    },
  );
  if (!token) {
    return { data: null };
  }
  return {
    data: isError ? null : data,
  };
};
