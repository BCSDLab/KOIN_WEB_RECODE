import { useQuery } from '@tanstack/react-query';
import { getBusNoticeInfo } from 'api/bus';

function useBusNoticeInfo() {
  const { data: busNotice } = useQuery({
    queryKey: ['bus', 'notice'],
    queryFn: async () => getBusNoticeInfo(),
  });

  return { busNotice };
}

export default useBusNoticeInfo;
