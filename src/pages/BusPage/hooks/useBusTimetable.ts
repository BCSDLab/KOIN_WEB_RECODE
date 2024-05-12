import { useSuspenseQuery } from '@tanstack/react-query';
import { getBusTimetableInfo } from 'api/bus';
import {
  BusRouteInfo as ShuttleInfo, Course, ExpressCourse, ExpressInfo, ShuttleCourse,
} from 'api/bus/entity';

const TIMETABLE_KEY = 'timetable';

interface ShuttleTimetable {
  info: ShuttleInfo;
  type: 'shuttle';
}

interface ExpressTimetable {
  info: ExpressInfo;
  type: 'express';
}

function useBusTimetable(course: ShuttleCourse): ShuttleTimetable;

function useBusTimetable(course: ExpressCourse): ExpressTimetable;

function useBusTimetable(course: Course): ShuttleTimetable | ExpressTimetable | undefined {
  const { bus_type: busType, direction: busDirection, region: busRegion } = course;

  const { data } = useSuspenseQuery(
    {
      queryKey: [TIMETABLE_KEY, busType, busDirection, busRegion] as const,
      queryFn: (
        { queryKey: [, bus_type, direction, region] },
      ) => getBusTimetableInfo({ bus_type, direction, region }),
      select: (response) => {
        if (busType === 'express') {
          return {
            info: response as ExpressInfo,
            type: 'express' as const,
          };
        }

        return {
          info: response as ShuttleInfo,
          type: 'shuttle' as const,
        };
      },
    },
  );

  return data;
}

export default useBusTimetable;
