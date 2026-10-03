import { useSuspenseQuery } from '@tanstack/react-query';
import { timetableQueries } from 'api/timetable/queries';
import useUserType from 'utils/hooks/auth/useUserType';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';

function useSemesterCheck() {
  const userType = useUserType();
  const isLoggedIn = useIsLoggedIn();
  const { data } = useSuspenseQuery(timetableQueries.mySemester(isLoggedIn, { userType }));

  return { data };
}

export default useSemesterCheck;
