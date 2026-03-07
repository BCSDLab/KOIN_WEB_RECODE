import { useQuery } from '@tanstack/react-query';
import { getCallvanNotifications } from 'api/callvan';
import useTokenState from 'utils/hooks/state/useTokenState';

export const CALLVAN_NOTIFICATIONS_QUERY_KEY = ['callvanNotifications'] as const;

export const useCallvanNotifications = () => {
  const token = useTokenState();

  return useQuery({
    queryKey: CALLVAN_NOTIFICATIONS_QUERY_KEY,
    queryFn: () => getCallvanNotifications(token),
    enabled: !!token,
  });
};

export default useCallvanNotifications;
