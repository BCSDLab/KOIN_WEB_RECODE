import { queryOptions, useQuery } from '@tanstack/react-query';
import * as api from 'api';
import { useSetRecoilState } from 'recoil';
import { userInfoState } from 'utils/recoil/userInfoState';

const useUserInfo = (token: string) => {
  const setUserInfo = useSetRecoilState(userInfoState);

  const { data: userInfo, error } = useQuery(
    queryOptions({
      queryKey: ['userInfo', token],
      queryFn: () => api.auth.getUser(token),
      select: (data) => setUserInfo(data),
    }),
  );
  if (error) {
    setUserInfo(null);
  }
  return { userInfo };
};

export default useUserInfo;
