import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { isKoinError, sendClientError } from '@bcsdlab/koin';
import * as api from 'api';
import { CheckPasswordRequest } from 'api/auth/entity';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

const useCheckPassword = () => {
  const token = useTokenState();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate, isSuccess, error } = useMutation({
    mutationFn: (password: CheckPasswordRequest) => api.auth.checkPassword(token, password),
    onSuccess: () => {
      showToast('success', '비밀번호 확인이 완료되었습니다.');
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) {
          setErrorMessage('비밀번호가 일치하지 않습니다.');
          return;
        }
        if (err.status === 403) {
          setErrorMessage('비밀번호를 입력해주세요.');
          return;
        }
        const message = err.message || '에러가 발생했습니다.';
        setErrorMessage(message);
        sendClientError(err);
      }
    },
  });
  return {
    mutate,
    isSuccess,
    error,
    errorMessage,
  };
};

export default useCheckPassword;
