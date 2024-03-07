import { useQuery } from 'react-query';
import * as api from 'api';

const useUserInfo = (token: string) => {
  const { data: userInfo, isError: isUserDataError } = useQuery(
    ['userInfo'],
    () => api.auth.getUser(token),
  );

  return {
    userInfo: isUserDataError ? null : userInfo,
  };
};

export default useUserInfo;
