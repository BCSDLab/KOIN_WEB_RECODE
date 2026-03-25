import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { callvanMutations } from 'api/callvan/mutations';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

const useJoinCallvan = () => {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const mutation = callvanMutations.join(queryClient, token);

  const { mutate, isPending } = useMutation({
    ...mutation,
    onSuccess: async (...args) => {
      await mutation.onSuccess?.(...args);
      showToast('success', '참여가 완료되었습니다.');
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message || '참여에 실패했습니다.');
      } else {
        sendClientError(e);
        showToast('error', '참여에 실패했습니다.');
      }
    },
  });

  return { mutate, isPending };
};

export default useJoinCallvan;
