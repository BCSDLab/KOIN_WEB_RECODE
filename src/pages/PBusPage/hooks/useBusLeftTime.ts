import { useQueries } from '@tanstack/react-query';
import { getBusInfo } from 'api/bus';
import { BUS_TYPES } from 'static/bus';

const BUS_KEY = 'bus_info';

interface BusLeftTimeProps {
  departList: string[];
  arrivalList: string[];
}

const emptyRouteData = {
  now_bus: {
    remain_time: '미운행',
    bus_number: null,
  },
  next_bus: {
    remain_time: '미운행',
    bus_number: null,
  },
} as const;

const useBusLeftTime = ({ departList, arrivalList }: BusLeftTimeProps) => {
  const results = useQueries({
    // 이부분에서 suspense: true를 했던 이유를 모르겠습니다. v5의 경우 suspense에서 keepPreviousData를 사용할 수 없다고 합니다.
    queries: BUS_TYPES.map(({ key: type }, idx) => ({
      queryKey: [BUS_KEY, type, departList[idx], arrivalList[idx]],
      queryFn: () => getBusInfo(type, departList[idx], arrivalList[idx]),
      refetchInterval: 60000,
      staleTime: 60000,
      keepPreviousData: true,
    })),
  });

  return {
    data: results.map((result) => {
      if (result.isError) return emptyRouteData;
      return result.data;
    }),
  };
};

export default useBusLeftTime;
