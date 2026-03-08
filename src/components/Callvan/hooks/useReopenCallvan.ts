import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reopenCallvanPost } from 'api/callvan';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

const useReopenCallvan = () => {
  const token = useTokenState();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (postId: number) => reopenCallvanPost(token, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callvanInfiniteList'] });
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message || '재모집에 실패했습니다.');
      } else {
        sendClientError(e);
        showToast('error', '재모집에 실패했습니다.');
      }
    },
  });

  return { mutate, isPending };
};

export default useReopenCallvan;
