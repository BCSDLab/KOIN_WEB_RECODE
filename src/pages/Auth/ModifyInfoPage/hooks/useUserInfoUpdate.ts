import { auth } from 'api';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import showToast from 'utils/ts/showToast';

interface UserUpdateOption {
  onSuccess?: () => void;
  onError?: () => void;
}

const useUserInfoUpdate = (options: UserUpdateOption) => {
  const { status, mutate } = useMutation(auth.updateUser, {
    onSuccess: () => {
      options.onSuccess?.();
      showToast('success', '성공적으로 정보를 수정하였습니다.');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      if (error?.response?.data) {
        showToast('error', error.response.data.message || '에러가 발생했습니다.');
      }
    },
  });

  return {
    status,
    mutate,
  };
};

export default useUserInfoUpdate;
