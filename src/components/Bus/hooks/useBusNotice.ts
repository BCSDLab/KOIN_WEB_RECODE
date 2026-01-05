import { useSuspenseQuery } from '@tanstack/react-query';
import { getBusNoticeInfo } from 'api/bus';

const BUS_NOTICE_KEY = 'bus-notice';

const useBusNotice = () =>
  useSuspenseQuery({
    queryKey: [BUS_NOTICE_KEY],
    queryFn: getBusNoticeInfo,
  });

export default useBusNotice;
