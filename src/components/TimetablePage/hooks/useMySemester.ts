import { useSuspenseQuery } from '@tanstack/react-query';
import { timetableQueries } from 'api/timetable/queries';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';
import { useTokenStore } from 'utils/zustand/auth';

function useSemesterCheck() {
  const { userType } = useTokenStore();
  const isLoggedIn = useIsLoggedIn();
  const { data } = useSuspenseQuery(timetableQueries.mySemester(isLoggedIn, { userType }));

  return { data };
}

export default useSemesterCheck;
