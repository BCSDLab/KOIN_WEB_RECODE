import { useSuspenseQuery } from '@tanstack/react-query';
import { timetableQueries } from 'api/timetable/queries';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';

export default function useTotalGrades(timetableFrameId: number) {
  const isLoggedIn = useIsLoggedIn();

  return useSuspenseQuery({
    ...timetableQueries.lectureInfo(isLoggedIn, timetableFrameId),
    select: (data) => data?.total_grades,
  });
}
