import { AxiosError } from 'axios';
import * as api from 'api';
import showToast from 'utils/ts/showToast';
import { UserUpdateRequest } from 'api/auth/entity';
import useTokenState from 'utils/hooks/useTokenState';
import { useMutation } from '@tanstack/react-query';

interface UserUpdateOption {
  onSuccess?: () => void;
  onError?: () => void;
}

const useUserInfoUpdate = (options: UserUpdateOption) => {
  const token = useTokenState();
  const { status, mutate } = useMutation(
    {
      mutationFn: (data: UserUpdateRequest) => (
        api.auth.updateUser(token, data)
      ),
      onSuccess: () => {
        options.onSuccess?.();
        showToast('success', '성공적으로 정보를 수정하였습니다.');
      },
      onError: (error: AxiosError<{ message?: string }>) => {
        if (error?.response?.data) {
          showToast('error', error.response.data.message || '에러가 발생했습니다.');
        }
      },
    },
  );

  return {
    status,
    mutate,
  };
};

export default useUserInfoUpdate;
