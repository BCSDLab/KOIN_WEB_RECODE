import * as api from 'api';
import { useMutation } from '@tanstack/react-query';
import showToast from 'utils/ts/showToast';
import { isKoinError, sendClientError } from '@bcsdlab/koin';
import useTokenState from 'utils/hooks/useTokenState';
import { CheckPasswordRequest } from 'api/auth/entity';

const useCheckPassword = () => {
  const token = useTokenState();
  const { mutate, isSuccess, error } = useMutation({
    mutationFn: (password: CheckPasswordRequest) => api.auth.checkPassword(token, password),
    onSuccess: () => {
      showToast('success', '비밀번호 확인이 완료되었습니다.');
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 401) {
          return;
        }
        if (err.status === 403) {
          return;
        }
        const errorMessage = err.message || '에러가 발생했습니다.';
        showToast('error', errorMessage);
        sendClientError(err);
      }
    },
  });
  return { mutate, isSuccess, error };
};

export default useCheckPassword;
