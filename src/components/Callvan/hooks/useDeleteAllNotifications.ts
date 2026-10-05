import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { callvanMutations } from 'api/callvan/mutations';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

interface UseDeleteAllNotificationsProps {
  onSuccess?: () => void;
}

const useDeleteAllNotifications = ({ onSuccess }: UseDeleteAllNotificationsProps = {}) => {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const mutation = callvanMutations.deleteAllNotifications(queryClient, token);

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
