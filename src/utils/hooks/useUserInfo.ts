import { useQuery } from 'react-query';
import * as api from 'api';
import { useUserStore } from 'utils/zustand/userInfoState';

const useUserInfo = (token: string) => {
  const { setUserInfo } = useUserStore();
  const { data: userInfo, isError: isUserDataError } = useQuery(
    ['userInfo', token],
    () => api.auth.getUser(token),
    {
      onSuccess: (data) => {
        // fetching 성공 시 Recoil 상태 업데이트
        setUserInfo(data);
      },
      onError: () => {
        // 에러 발생 시 Recoil 상태를 null로 설정
        setUserInfo(null);
      },
    },
  );

  return {
    userInfo: isUserDataError ? null : userInfo,
  };
};

export default useUserInfo;
