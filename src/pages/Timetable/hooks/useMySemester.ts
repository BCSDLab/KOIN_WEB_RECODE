import { timetable } from 'api';
import { useSuspenseQuery } from '@tanstack/react-query';
import useTokenState from 'utils/hooks/useTokenState';

export const MY_SEMESTER_INFO_KEY = 'my_semester';

const useSemesterCheck = () => {
  const token = useTokenState();
  const { data } = useSuspenseQuery(
    {
      queryKey: [MY_SEMESTER_INFO_KEY],
      queryFn: () => (token ? timetable.getMySemester(token) : null),
    },
  );

  return {
    data,
  };
};

export default useSemesterCheck;
