import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { callvanMutations } from 'api/callvan/mutations';
import showToast from 'utils/ts/showToast';

interface UseDeleteAllNotificationsProps {
  onSuccess?: () => void;
}

const useDeleteAllNotifications = ({ onSuccess }: UseDeleteAllNotificationsProps = {}) => {
  const queryClient = useQueryClient();
  const mutation = callvanMutations.deleteAllNotifications(queryClient);

  const { mutate } = useMutation({
    ...mutation,
    onSuccess: async (...args) => {
      await mutation.onSuccess?.(...args);
      onSuccess?.();
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  return { mutate };
};

export default useDeleteAllNotifications;
