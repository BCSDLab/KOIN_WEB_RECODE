import { auth } from 'api';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import showToast from 'utils/ts/showToast';

interface ISignupOption {
  onSuccess?: () => void;
  onError?: () => void;
}

const useSignup = (options: ISignupOption) => {
  const { status, mutate } = useMutation(auth.signup, {
    onSuccess: () => {
      options.onSuccess?.();
      showToast('success', '아우누리 이메일로 인증 메일을 발송했습니다. 확인 부탁드립니다.');
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

export default useSignup;
