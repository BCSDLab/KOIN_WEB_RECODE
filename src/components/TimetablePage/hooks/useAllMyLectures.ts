import { useSuspenseQuery } from '@tanstack/react-query';
import { timetableQueries } from 'api/timetable/queries';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';

export default function useAllMyLectures() {
  const isLoggedIn = useIsLoggedIn();
  const { data } = useSuspenseQuery(timetableQueries.allLectures(isLoggedIn));

  return data ? data.timetable : null;
}
