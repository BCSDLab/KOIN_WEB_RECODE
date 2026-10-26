import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { callvanMutations } from 'api/callvan/mutations';
import useCallvanRestrictionModal from 'components/Callvan/hooks/useCallvanRestrictionModal';
import showToast from 'utils/ts/showToast';

const useJoinCallvan = () => {
  const queryClient = useQueryClient();
  const mutation = callvanMutations.join(queryClient);
  const { openFromError } = useCallvanRestrictionModal();

  const { mutate, isPending } = useMutation({
    ...mutation,
    onSuccess: async (...args) => {
      await mutation.onSuccess?.(...args);
      showToast('success', '참여가 완료되었습니다.');
    },
    onError: async (e) => {
      try {
        if (await openFromError(e)) return;
      } catch (restrictionError) {
        sendClientError(restrictionError);
      }

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
