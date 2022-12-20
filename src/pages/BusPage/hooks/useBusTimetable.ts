import { getBusTimetableInfo } from 'api/bus';
import {
  BusRouteInfo as ShuttleInfo, Course, ExpressCourse, ExpressInfo, ShuttleCourse,
} from 'api/bus/entity';
import { useQuery } from 'react-query';

const TIMETABLE_KEY = 'timetable';

interface ShuttleTimetable {
  info: ShuttleInfo[],
  type: 'shuttle',
}

interface ExpressTimetable {
  info: ExpressInfo[]
  type: 'express',
}

function useBusTimetable(course: ShuttleCourse): ShuttleTimetable;

function useBusTimetable(course: ExpressCourse): ExpressTimetable;

function useBusTimetable(course: Course): ShuttleTimetable | ExpressTimetable | undefined {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { bus_type, direction, region } = course;

  const { data } = useQuery({
    queryKey: [TIMETABLE_KEY, bus_type, direction, region],
    queryFn: () => getBusTimetableInfo({ bus_type, direction, region }),
    suspense: true,
    select: (response) => {
      if (bus_type === 'express') {
        return {
          info: response as ExpressInfo[],
          type: 'express' as const,
        };
      }

      return {
        info: response as ShuttleInfo[],
        type: 'shuttle' as const,
      };
    },
  });

  return data;
}

export default useBusTimetable;
