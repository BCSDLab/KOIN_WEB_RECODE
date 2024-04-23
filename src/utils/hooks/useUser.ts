import { useSuspenseQuery } from '@tanstack/react-query';
import { getUser } from 'api/auth';
import { useTokenStore } from 'utils/zustand/auth';

export const useUser = () => {
  const { token } = useTokenStore();
  const { data, isError } = useSuspenseQuery({
    queryKey: ['userInfo', token],
    queryFn: () => (token ? getUser(token) : null),
  });

  return {
    data: isError ? null : data,
  };
};
