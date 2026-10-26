import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { callvanMutations } from 'api/callvan/mutations';
import showToast from 'utils/ts/showToast';

const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  const mutation = callvanMutations.markAllNotificationsRead(queryClient);

  const { mutate } = useMutation({
    ...mutation,
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  return { mutate };
};

export default useMarkAllNotificationsRead;
