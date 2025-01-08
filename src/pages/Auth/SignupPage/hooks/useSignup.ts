import { useMutation } from '@tanstack/react-query';
import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { auth } from 'api';
import showToast from 'utils/ts/showToast';

interface ISignupOption {
  onSuccess?: () => void;
  onError?: () => void;
}

const useSignup = (options: ISignupOption) => {
  const { status, mutate } = useMutation({
    mutationFn: auth.signup,
    onSuccess: () => {
      options.onSuccess?.();
      showToast('success', '아우누리 이메일로 인증 메일을 발송했습니다. 확인 부탁드립니다.');
    },
    onError: (error) => {
      if (isKoinError(error)) {
        if (error.status === 409) {
          showToast('error', '이미 가입된 이메일입니다.');
          return;
        }
        const { message } = error;
        showToast('error', message || '회원가입에 실패했습니다.');
        sendClientError(error);
        return;
      }
      showToast('error', '회원가입에 실패했습니다.');
      sendClientError(error);
    },
  });

  return {
    status,
    mutate,
  };
};

export default useSignup;
