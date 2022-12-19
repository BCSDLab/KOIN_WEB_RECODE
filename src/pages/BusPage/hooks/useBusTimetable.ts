import { getBusTimetableInfo } from 'api/bus';
import { BusRouteInfo, Course, ExpressInfo } from 'api/bus/entity';
import { useQuery } from 'react-query';

const TIMETABLE_KEY = 'timetable';

const useBusTimetable = (course: Course) => {
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
        info: response as BusRouteInfo[],
        type: 'shuttle' as const,
      };
    },
  });

  return { data };
};

export default useBusTimetable;
