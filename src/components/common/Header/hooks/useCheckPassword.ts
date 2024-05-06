import * as api from 'api';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import showToast from 'utils/ts/showToast';
import { sendClientError } from '@bcsdlab/koin';

const useCheckPassword = () => {
  const mutation = useMutation({
    mutationFn: api.auth.checkPassword,
    onSuccess: () => {
      showToast('success', '비밀번호 확인이 완료되었습니다.');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      if (error.response?.status === 401) {
        showToast('error', '비밀번호가 일치하지 않습니다.');
      } else if (error.response?.status === 403) {
        showToast('error', '권한이 필요합니다. 관리자에게 문의해주세요.');
      } else {
        const errorMessage = error.response?.data.message || '에러가 발생했습니다.';
        showToast('error', errorMessage);
        sendClientError(error);
      }
    },
  });
  return mutation;
};

export default useCheckPassword;
