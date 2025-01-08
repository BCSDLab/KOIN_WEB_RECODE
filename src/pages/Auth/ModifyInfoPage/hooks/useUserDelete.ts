import { useMutation } from '@tanstack/react-query';
import * as api from 'api';
import { AxiosError } from 'axios';
import { useLogout } from 'utils/hooks/auth/useLogout';
import showToast from 'utils/ts/showToast';

const useUserDelete = () => {
  const logout = useLogout();
  const mutation = useMutation({
    mutationFn: api.auth.deleteUser,
    onSuccess: () => {
      showToast('success', '성공적으로 계정을 삭제하였습니다.');
      logout();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = error.response?.data.message || '에러가 발생했습니다.';
      showToast('error', errorMessage);
    },
  });

  return mutation;
};

export default useUserDelete;
