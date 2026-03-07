import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markNotificationRead } from 'api/callvan';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';
import { CALLVAN_NOTIFICATIONS_QUERY_KEY } from './useCallvanNotifications';

const useMarkNotificationRead = () => {
  const token = useTokenState();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (notificationId: number) => markNotificationRead(token, notificationId),
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

export default useMarkNotificationRead;
