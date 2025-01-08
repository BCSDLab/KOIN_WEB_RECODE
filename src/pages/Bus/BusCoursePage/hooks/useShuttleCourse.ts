import { getShuttleCourseInfo } from 'api/bus';
import { useSuspenseQuery } from '@tanstack/react-query';

function useShuttleCourse() {
  const { data: shuttleCourse } = useSuspenseQuery({
    queryKey: ['bus', 'courses', 'shuttle'],
    queryFn: async () => getShuttleCourseInfo(),
  });

  return { shuttleCourse };
}

export default useShuttleCourse;
