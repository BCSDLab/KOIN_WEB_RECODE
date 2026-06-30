import { useSuspenseQuery } from '@tanstack/react-query';
import { Semester } from 'api/timetable/entity';
import { timetableQueries } from 'api/timetable/queries';
import { useTokenStore } from 'utils/zustand/auth';
import useSemesterCheck from './useMySemester';

function useTimetableFrameList(token: string, semester: Semester) {
  const { userType } = useTokenStore();
  const { data: mySemester } = useSemesterCheck(token);
  const hasUserSemester = mySemester?.semesters.length !== 0;
  const { data } = useSuspenseQuery(
    timetableQueries.frameList(token, semester, { fallbackOnError: true, hasUserSemester, userType }),
  );

  return { data };
}

export default useTimetableFrameList;
