import { useSuspenseQuery } from '@tanstack/react-query';
import { timetable } from 'api';

const useSemester = () => {
  const { data } = useSuspenseQuery(
    {
      queryKey: ['semester'],
      queryFn: timetable.getSemesterInfoList,
    },

  );
  return { data };
};

export default useSemester;
