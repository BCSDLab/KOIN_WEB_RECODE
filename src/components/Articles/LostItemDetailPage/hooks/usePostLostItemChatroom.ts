import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { articleMutations } from 'api/articles/mutations';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

const usePostLostItemChatroom = () => {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const mutation = articleMutations.createLostItemChatroom(queryClient, token);
  const { mutateAsync } = useMutation({
    ...mutation,
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  return { mutateAsync };
};

export default usePostLostItemChatroom;
