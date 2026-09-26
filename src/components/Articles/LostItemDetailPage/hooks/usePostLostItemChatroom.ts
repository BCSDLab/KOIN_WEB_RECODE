import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { articleMutations } from 'api/articles/mutations';
import showToast from 'utils/ts/showToast';

const usePostLostItemChatroom = () => {
  const queryClient = useQueryClient();
  const mutation = articleMutations.createLostItemChatroom(queryClient);
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
