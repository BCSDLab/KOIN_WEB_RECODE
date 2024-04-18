import { queryOptions, useQuery } from '@tanstack/react-query';
import { nicknameDuplicateCheck } from 'api/auth';
import { NicknameDuplicateCheckResponse } from 'api/auth/entity';
import { KoinError } from 'interfaces/APIError';
import { useEffect } from 'react';

import showToast from 'utils/ts/showToast';

const NICKNAME_DUPLICATE_CHECK_KEY = 'nickname-duplicate-check';

function useNicknameCheckServer(nickname: string) {
  const { data, error, status } = useQuery<
  Awaited<ReturnType<typeof nicknameDuplicateCheck>>,
  KoinError,
  NicknameDuplicateCheckResponse | undefined,
  [string, string]
  >(
    queryOptions({
      queryKey: [NICKNAME_DUPLICATE_CHECK_KEY, nickname],
      queryFn: async ({ queryKey }) => {
        const [, nicknameParam] = queryKey;
        return nicknameDuplicateCheck(nicknameParam);
      },
      enabled: !!nickname,
    }),
  );

  useEffect(() => {
    if (status === 'success') {
      showToast('success', '사용 가능한 닉네임입니다.');
    } else if (status === 'error') {
      if (error?.status === 409) {
        showToast('error', '사용 불가능한 닉네임입니다.');
      } else if (error?.status === 412) {
        showToast('error', '올바르지 않은 닉네임 형식입니다.');
      } else {
        showToast('error', '네트워크 연결을 확인해주세요.');
      }
    }
  }, [status, error]);

  return { data, error, status };
}

export default useNicknameCheckServer;
