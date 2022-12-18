import { getBusTimetableInfo } from 'api/bus';
import { BusRouteInfo, Course, ExpressInfo } from 'api/bus/entity';
import { useQuery } from 'react-query';
import useIndexValueSelect from './useIndexValueSelect';

const TIMETABLE_KEY = 'timetable';

const useBusTimetable = (courseList: readonly Course[]) => {
  const [selectedCourseId, handleCourseChange] = useIndexValueSelect();

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { bus_type, direction, region } = courseList[selectedCourseId];

  const { data } = useQuery({
    queryKey: [TIMETABLE_KEY, bus_type, direction, region],
    queryFn: () => getBusTimetableInfo({ bus_type, direction, region }),
    suspense: true,
    select: (response) => {
      if (bus_type === 'express') {
        const res = response as Array<ExpressInfo>;
        return {
          info: res,
          type: 'express' as const,
        };
      }

      const res = response as Array<BusRouteInfo>;
      return {
        info: res,
        type: 'shuttle' as const,
      };
    },
  });

  return { data, selectedCourse: courseList[selectedCourseId], handleCourseChange };
};

export default useBusTimetable;
