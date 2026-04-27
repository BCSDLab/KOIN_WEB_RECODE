import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { callvanMutations } from 'api/callvan/mutations';
import useCallvanRestrictionModal from 'components/Callvan/hooks/useCallvanRestrictionModal';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

const useCreateCallvan = () => {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const mutation = callvanMutations.create(queryClient, token);
  const { openFromError } = useCallvanRestrictionModal(token);

  const { mutate, isPending } = useMutation({
    ...mutation,
    onError: async (e) => {
      if (await openFromError(e)) return;

      if (isKoinError(e)) {
        showToast('error', e.message || '게시글 작성에 실패했습니다.');
      } else {
        sendClientError(e);
        showToast('error', '게시글 작성에 실패했습니다.');
      }
    },
  });

  return { mutate, isPending };
};

export default useCreateCallvan;
