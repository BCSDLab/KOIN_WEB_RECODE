import { useSuspenseQuery } from '@tanstack/react-query';
import { getBusRouteInfo } from 'api/bus';
import { Arrival, BusRouteParams, Depart } from 'api/bus/entity';
import { transformBusRoute } from 'pages/BusRoutePage/utils/transform';

const BUS_ROUTE_KEY = 'bus-route';

interface BusRouteQueryParams extends Omit<BusRouteParams, 'depart' | 'arrival'> {
  depart: Depart | '';
  arrival: Arrival | '';
}

const useBusRoute = (params: BusRouteQueryParams) => {
  const { depart, arrival, ...rest } = params;
  const isReady = Boolean(depart) && Boolean(arrival);

  return useSuspenseQuery({
    queryKey: [BUS_ROUTE_KEY, params],
    queryFn: async () => {
      if (!isReady) {
        throw new Error('Invalid params');
      }

      const response = await getBusRouteInfo({
        ...rest,
        depart: depart as Depart,
        arrival: arrival as Arrival,
      });

      return transformBusRoute(response);
    },
  });
};

export default useBusRoute;
