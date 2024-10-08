import { timetable } from 'api';
import { useSuspenseQuery } from '@tanstack/react-query';

export const MY_SEMESTER_INFO_KEY = 'my_semester';

function useSemesterCheck(token: string) {
  const { data } = useSuspenseQuery(
    {
      queryKey: [MY_SEMESTER_INFO_KEY],
      queryFn: () => (token ? timetable.getMySemester(token) : null),
    },
  );

  return { data };
}

export default useSemesterCheck;
