import { useSuspenseQuery } from '@tanstack/react-query';
import { getMySemester } from 'api/timetable';
import { useTokenStore } from 'utils/zustand/auth';

export const MY_SEMESTER_INFO_KEY = 'my_semester';

function useSemesterCheck(token: string) {
  const { userType } = useTokenStore();
  const { data } = useSuspenseQuery({
    queryKey: [MY_SEMESTER_INFO_KEY],
    queryFn: () => (token && userType === 'STUDENT' ? getMySemester(token) : null),
  });

  return { data };
}

export default useSemesterCheck;
