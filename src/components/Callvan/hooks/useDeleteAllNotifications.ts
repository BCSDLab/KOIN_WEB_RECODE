import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAllNotifications } from 'api/callvan';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';
import { CALLVAN_NOTIFICATIONS_QUERY_KEY } from './useCallvanNotifications';

interface UseDeleteAllNotificationsProps {
  onSuccess?: () => void;
}

const useDeleteAllNotifications = ({ onSuccess }: UseDeleteAllNotificationsProps = {}) => {
  const token = useTokenState();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => deleteAllNotifications(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CALLVAN_NOTIFICATIONS_QUERY_KEY });
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
