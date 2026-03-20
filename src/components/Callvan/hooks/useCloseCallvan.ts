import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { callvanMutations } from 'api/callvan/mutations';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

const useCloseCallvan = () => {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const mutation = callvanMutations.close(queryClient, token);

  const { mutate, isPending } = useMutation({
    ...mutation,
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message || '모집 마감에 실패했습니다.');
      } else {
        sendClientError(e);
        showToast('error', '모집 마감에 실패했습니다.');
      }
    },
  });

  return { mutate, isPending };
};

export default useCloseCallvan;
