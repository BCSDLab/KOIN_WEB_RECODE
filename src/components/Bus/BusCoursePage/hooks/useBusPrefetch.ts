import { useQueryClient } from '@tanstack/react-query';
import { DirectionType, ExpressCourse, ShuttleCourse } from 'api/bus/entity';
import { busQueries } from 'api/bus/queries';

export type PrefetchParams =
  | {
    type: 'shuttle_detail';
    id: string;
  }
  | {
    type: 'express';
    bus_type: ExpressCourse['bus_type'];
    direction: DirectionType;
    region: string;
  }
  | {
    type: 'shuttle';
    bus_type: ShuttleCourse['bus_type'];
    direction: DirectionType;
    region: string;
  }
  | {
    type: 'city';
    bus_number: number;
    direction: string;
  };

export default function useBusPrefetch() {
  const queryClient = useQueryClient();

  const prefetchBusTimetable = async (params: PrefetchParams) => {
    switch (params.type) {
      case 'shuttle': {
        return queryClient.prefetchQuery(
          busQueries.shuttleTimetable({
            bus_type: params.bus_type,
            direction: params.direction,
            region: params.region,
          }),
        );
      }

      case 'shuttle_detail': {
        return queryClient.prefetchQuery(busQueries.shuttleTimetableDetail(params.id));
      }

      case 'express': {
        return queryClient.prefetchQuery(
          busQueries.expressTimetable({
            bus_type: params.bus_type,
            direction: params.direction,
            region: params.region,
          }),
        );
      }

      case 'city': {
        return queryClient.prefetchQuery(
          busQueries.cityTimetable({
            bus_number: params.bus_number,
            direction: params.direction,
          }),
        );
      }
    }
  }

  return prefetchBusTimetable;
}
