import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { callvanMutations } from 'api/callvan/mutations';
import showToast from 'utils/ts/showToast';

const useCompleteCallvan = () => {
  const queryClient = useQueryClient();
  const mutation = callvanMutations.complete(queryClient);

  const { mutate, isPending } = useMutation({
    ...mutation,
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message || '이용 완료 처리에 실패했습니다.');
      } else {
        sendClientError(e);
        showToast('error', '이용 완료 처리에 실패했습니다.');
      }
    },
  });

  return { mutate, isPending };
};

export default useCompleteCallvan;
