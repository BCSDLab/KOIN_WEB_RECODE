import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation } from '@tanstack/react-query';
import { nicknameDuplicateCheck } from 'api/auth';

import showToast from 'utils/ts/showToast';

function useNicknameCheckServer() {
  const { data, status, mutate } = useMutation({
    mutationFn: nicknameDuplicateCheck,
    onSuccess: () => {
      showToast('success', '사용 가능한 닉네임입니다.');
    },
    onError: (error) => {
      if (isKoinError(error)) {
        if (error.status === 409) {
          showToast('error', '사용 불가능한 닉네임입니다.');
          return;
        }
        if (error.status === 412) {
          showToast('error', '올바르지 않은 닉네임 형식입니다.');
          return;
        }
        sendClientError(error);
        showToast('error', '네트워크 연결을 확인해주세요.');
      }
    },
  });

  return { data, status, mutate };
}

export default useNicknameCheckServer;
