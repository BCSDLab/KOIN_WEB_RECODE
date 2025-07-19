import { AxiosError } from 'axios';
import * as api from 'api';
import showToast from 'utils/ts/showToast';
import {
  UserUpdateRequest,
  GeneralUserUpdateRequest,
} from 'api/auth/entity';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useMutation } from '@tanstack/react-query';
import useLogger from 'utils/hooks/analytics/useLogger';

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
  const logger = useLogger();
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
      logger.actionEventClick({
        event_label: 'user_info',
        value: '정보수정 완료',
        event_category: 'click',
        team: 'USER',
      });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      if (error.message) {
        showToast('error', error.message || '에러가 발생했습니다.');
      }
      options.onError?.();
      logger.actionEventClick({
        event_label: 'user_info',
        value: '정보수정 실패',
        event_category: 'click',
        team: 'USER',
      });
    },
  });

  return {
    status,
    mutate,
  };
};

export default useUserInfoUpdate;
