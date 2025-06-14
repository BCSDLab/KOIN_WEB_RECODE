import { AxiosError } from 'axios';
import * as api from 'api';
import showToast from 'utils/ts/showToast';
import {
  UserUpdateRequest,
  GeneralUserUpdateRequest,
} from 'api/auth/entity';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useMutation } from '@tanstack/react-query';

interface UserUpdateOption {
  onSuccess?: () => void;
  onError?: () => void;
}

type UserType = 'STUDENT' | 'GENERAL';

const useUserInfoUpdate = <T = unknown>(
  userType: UserType,
  options: UserUpdateOption = {},
) => {
  const token = useTokenState();
  const { status, mutate } = useMutation<
  T,
  AxiosError<{ message?: string }>,
  UserUpdateRequest | GeneralUserUpdateRequest
  >({
    mutationFn: (data) => (
      userType === 'STUDENT'
        ? api.auth.updateUser(token, data as UserUpdateRequest) as Promise<T>
        : api.auth.updateGeneralUser(token, data as GeneralUserUpdateRequest) as Promise<T>
    ),
    onSuccess: () => {
      options.onSuccess?.();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      if (error.message) {
        showToast('error', error.message || '에러가 발생했습니다.');
      }
      options.onError?.();
    },
  });

  return {
    status,
    mutate,
  };
};

export default useUserInfoUpdate;
