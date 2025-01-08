import { useMutation } from '@tanstack/react-query';
import * as api from 'api';
import { UserUpdateRequest } from 'api/auth/entity';
import { AxiosError } from 'axios';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

interface UserUpdateOption {
  onSuccess?: () => void;
  onError?: () => void;
}

const useUserInfoUpdate = (options: UserUpdateOption) => {
  const token = useTokenState();
  const { status, mutate } = useMutation({
    mutationFn: (data: UserUpdateRequest) => api.auth.updateUser(token, data),
    onSuccess: () => {
      options.onSuccess?.();
      showToast('success', '성공적으로 정보를 수정하였습니다.');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      if (error.message) {
        showToast('error', error.message || '에러가 발생했습니다.');
      }
    },
  });

  return {
    status,
    mutate,
  };
};

export default useUserInfoUpdate;
