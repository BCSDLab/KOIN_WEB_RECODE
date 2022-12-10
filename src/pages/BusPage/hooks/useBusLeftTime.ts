import { getBusInfo } from 'api/bus';
import { useQueries } from 'react-query';

const BUS_KEY = 'bus_info';
const BUS_TYPES = ['shuttle', 'express', 'city'];

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
  const queries = BUS_TYPES.map((type, idx) => ({
    queryKey: [BUS_KEY, type, departList[idx], arrivalList[idx]],
    queryFn: () => getBusInfo(type, departList[idx], arrivalList[idx]),
    refetchInterval: 60000,
    staleTime: 60000,
    suspense: true,
    keepPreviousData: true,
  }));

  const results = useQueries(queries);

  return {
    data: results.map((result) => {
      if (result.isError) return emptyRouteData;
      return result.data;
    }),
  };
};

export default useBusLeftTIme;
