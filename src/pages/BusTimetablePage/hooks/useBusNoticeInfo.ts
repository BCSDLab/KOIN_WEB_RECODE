import { useQuery } from '@tanstack/react-query';
import { getBusNoticeInfo } from 'api/bus';

function useBusNoticeInfo() {
  const { data: busNoticeInfo } = useQuery({
    queryKey: ['bus', 'notice'],
    queryFn: async () => getBusNoticeInfo(),
  });

  return { busNoticeInfo };
}

export default useBusNoticeInfo;
