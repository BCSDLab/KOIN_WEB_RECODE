import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelCallvan } from 'api/callvan';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

const useCancelCallvan = () => {
  const token = useTokenState();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (postId: number) => cancelCallvan(token, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callvanInfiniteList'] });
      showToast('success', '참여가 취소되었습니다.');
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message || '참여 취소에 실패했습니다.');
      } else {
        sendClientError(e);
        showToast('error', '참여 취소에 실패했습니다.');
      }
    },
  });

  return { mutate, isPending };
};

export default useCancelCallvan;
