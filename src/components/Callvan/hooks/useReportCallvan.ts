import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { callvanMutations } from 'api/callvan/mutations';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

const useReportCallvan = (postId: number) => {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const mutation = callvanMutations.report(queryClient, token, postId);

  const { mutate, isPending } = useMutation({
    ...mutation,
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message || '신고 접수에 실패했습니다.');
      } else {
        sendClientError(e);
        showToast('error', '신고 접수에 실패했습니다.');
      }
    },
  });

  return { mutate, isPending };
};

export default useReportCallvan;
