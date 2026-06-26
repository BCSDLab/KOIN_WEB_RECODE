import { useSuspenseQuery } from '@tanstack/react-query';
import { Semester } from 'api/timetable/entity';
import { timetableQueries } from 'api/timetable/queries';
import { useTokenStore } from 'utils/zustand/auth';

function useTimetableFrameList(token: string, semester: Semester) {
  const { userType } = useTokenStore();
  const { data } = useSuspenseQuery(timetableQueries.frameList(token, semester, { fallbackOnError: true, userType }));

  return { data };
}

export default useTimetableFrameList;
