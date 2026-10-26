import { useRouter } from 'next/router';

import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { articleMutations } from 'api/articles/mutations';
import ROUTES from 'static/routes';
import showToast from 'utils/ts/showToast';

const useDeleteLostItemChatroom = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = articleMutations.blockLostItemChatroom(queryClient);

  const { mutate } = useMutation({
    ...mutation,
    onSuccess: async (...args) => {
      await mutation.onSuccess?.(...args);
      showToast('success', '채팅방이 차단되었습니다.');
      router.push(ROUTES.LostItemChat());
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  return { mutate };
};

export default useDeleteLostItemChatroom;
