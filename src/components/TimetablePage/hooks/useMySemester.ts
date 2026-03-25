import { useSuspenseQuery } from '@tanstack/react-query';
import { timetableQueries } from 'api/timetable/queries';
import { useTokenStore } from 'utils/zustand/auth';

function useSemesterCheck(token: string) {
  const { userType } = useTokenStore();
  const { data } = useSuspenseQuery(timetableQueries.mySemester(token, { userType }));

  return { data };
}

export default useSemesterCheck;
