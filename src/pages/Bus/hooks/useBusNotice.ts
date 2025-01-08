import { getBusNoticeInfo } from 'api/bus';
import { useSuspenseQuery } from '@tanstack/react-query';

const BUS_NOTICE_KEY = 'bus-notice';

const useBusNotice = () =>
  useSuspenseQuery({
    queryKey: [BUS_NOTICE_KEY],
    queryFn: getBusNoticeInfo,
  });

export default useBusNotice;
