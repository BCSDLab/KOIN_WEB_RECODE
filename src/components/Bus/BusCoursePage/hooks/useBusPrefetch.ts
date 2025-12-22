import { useQueryClient } from '@tanstack/react-query';
import {
  getBusTimetableInfo,
  getCityBusTimetableInfo,
  getShuttleTimetableDetailInfo,
} from 'api/bus';
import { CourseBusType, DirectionType } from 'api/bus/entity';

export type PrefetchParams =
  | {
    type: 'shuttle_detail';
    id: string;
  }
  | {
    type: 'express';
    bus_type: CourseBusType;
    direction: DirectionType;
    region: string;
  }
  | {
    type: 'shuttle';
    bus_type: CourseBusType;
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
        return queryClient.prefetchQuery({
          queryKey: ['timetable', params.type, params.direction, params.region],
          queryFn: () =>
            getBusTimetableInfo({
              bus_type: params.bus_type,
              direction: params.direction,
              region: params.region,
            }),
        });
      }

      case 'shuttle_detail': {
        return queryClient.prefetchQuery({
          queryKey: ['bus', 'shuttle', 'timetable', params.id],
          queryFn: () => getShuttleTimetableDetailInfo({ id: params.id }),
        });
      }

      case 'express': {
        return queryClient.prefetchQuery({
          queryKey: ['timetable', params.type, params.direction, params.region],
          queryFn: () =>
            getBusTimetableInfo({
              bus_type: params.bus_type,
              direction: params.direction,
              region: params.region,
            }),
        });
      }

      case 'city': {
        return queryClient.prefetchQuery({
          queryKey: ['timetable', params.bus_number, params.direction],
          queryFn: () =>
            getCityBusTimetableInfo({
              bus_number: params.bus_number,
              direction: params.direction,
            }),
        });
      }
    }
  }

  return prefetchBusTimetable;
}
