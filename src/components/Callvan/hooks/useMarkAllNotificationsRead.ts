import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markAllNotificationsRead } from 'api/callvan';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';
import { CALLVAN_NOTIFICATIONS_QUERY_KEY } from './useCallvanNotifications';

const useMarkAllNotificationsRead = () => {
  const token = useTokenState();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => markAllNotificationsRead(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CALLVAN_NOTIFICATIONS_QUERY_KEY });
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  return { mutate };
};

export default useMarkAllNotificationsRead;
