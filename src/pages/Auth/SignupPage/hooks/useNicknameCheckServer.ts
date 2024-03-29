import { auth } from 'api';
import { KoinError } from 'interfaces/APIError';
import { useQuery } from 'react-query';
import showToast from 'utils/ts/showToast';

const useNicknameCheckServer = (nickname: string) => {
  const { data, error, status } = useQuery(
    ['nickname-duplicate-check', nickname],
    ({ queryKey }) => auth.nicknameDuplicateCheck(queryKey[1]),
    {
      enabled: !!nickname,
      onSuccess: () => {
        showToast('success', '사용 가능한 닉네임입니다.');
      },
      onError: (responseError: KoinError) => {
        if (responseError.status === 409) {
          showToast('error', '사용 불가능한 닉네임입니다.');
          return;
        }
        if (responseError.status === 412) {
          showToast('error', '올바르지 않은 닉네임 형식입니다.');
          return;
        }
        showToast('error', '네트워크 연결을 확인해주세요.');
      },
    },
  );

  return {
    data,
    error,
    status,
  };
};

export default useNicknameCheckServer;
