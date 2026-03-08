import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { closeCallvanPost } from 'api/callvan';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

const useCloseCallvan = () => {
  const token = useTokenState();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (postId: number) => closeCallvanPost(token, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callvanInfiniteList'] });
    },
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
