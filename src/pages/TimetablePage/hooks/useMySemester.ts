import { timetable } from 'api';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useTokenStore } from 'utils/store/useTokenStore';

export const MY_SEMESTER_INFO_KEY = 'my_semester';

function useSemesterCheck(token: string) {
  const { userType } = useTokenStore();
  const { data } = useSuspenseQuery(
    {
      queryKey: [MY_SEMESTER_INFO_KEY],
      queryFn: () => ((token && userType === 'STUDENT') ? timetable.getMySemester(token) : null),
    },
  );

  return { data };
}

export default useSemesterCheck;
