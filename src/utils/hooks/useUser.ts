import { getUser } from 'api/auth';
import { useQuery } from 'react-query';
import { useTokenStore } from 'utils/zustand';

export const useUser = () => {
  const { token } = useTokenStore();
  const { data, isError, isIdle } = useQuery(
    ['userInfo', token],
    () => getUser(token),
    {
      suspense: true,
      enabled: !!token,
    },
  );
  if (!token && !isIdle) {
    return { data: null };
  }
  return {
    data: isError ? null : data,
  };
};
