import { auth } from 'api';
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
    onError: () => {
      showToast('error', '서버에 오류가 발생했습니다.');
    },
  });

  return {
    status,
    mutate,
  };
};

export default useSignup;
