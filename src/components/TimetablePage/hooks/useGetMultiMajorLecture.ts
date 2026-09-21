import { useSuspenseQuery } from '@tanstack/react-query';
import { timetableQueries } from 'api/timetable/queries';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';

export default function useGetMultiMajorLecture() {
  const isLoggedIn = useIsLoggedIn();

  return useSuspenseQuery({
    ...timetableQueries.allLectures(isLoggedIn),
    select: (data) => (data ? data.timetable.filter((item) => item.course_type === '다전공') : null),
  });
}
