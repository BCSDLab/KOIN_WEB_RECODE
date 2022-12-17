import { getBusInfo } from 'api/bus';
import { BusResponse } from 'api/bus/entity';
import { AxiosError } from 'axios';
import { QueryOptions, useQueries } from 'react-query';
import { BUS_TYPES } from 'static/bus';

const BUS_KEY = 'bus_info';

interface Props {
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

const useBusLeftTIme = ({ departList, arrivalList }: Props) => {
  const queries = BUS_TYPES.map<QueryOptions<BusResponse, AxiosError, BusResponse, string[]>>(
    (type, idx) => ({
      queryKey: [BUS_KEY, type, departList[idx], arrivalList[idx]],
      queryFn: ({ queryKey: [, busType, depart, arrival] }) => getBusInfo(busType, depart, arrival),
      refetchInterval: 60000,
      staleTime: 60000,
      suspense: true,
      keepPreviousData: true,
    }),
  );

  const results = useQueries(queries);

  return {
    data: results.map((result) => {
      if (result.isError) return emptyRouteData;
      return result.data;
    }),
  };
};

export default useBusLeftTIme;
