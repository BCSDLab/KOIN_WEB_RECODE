import { useSuspenseQuery } from '@tanstack/react-query';
import type { Semester } from 'api/timetable/entity';
import { timetableQueries } from 'api/timetable/queries';
import useUserType from 'utils/hooks/auth/useUserType';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';

import useSemesterCheck from './useMySemester';

function useTimetableFrameList(semester: Semester) {
  const userType = useUserType();
  const isLoggedIn = useIsLoggedIn();
  const { data: mySemester } = useSemesterCheck();
  const hasUserSemester = mySemester?.semesters.length !== 0;
  const { data } = useSuspenseQuery(
    timetableQueries.frameList(isLoggedIn, semester, { fallbackOnError: true, hasUserSemester, userType }),
  );

  return { data };
}

export default useTimetableFrameList;
