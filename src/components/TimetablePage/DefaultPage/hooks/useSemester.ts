import { timetable } from 'api';
import { useQuery } from 'react-query';

const SEMESTER_INFO_KEY = 'semester';

const useSemester = () => {
  const { data } = useQuery(
    SEMESTER_INFO_KEY,
    timetable.getSemesterInfoList,
    {
      useErrorBoundary: false,
      suspense: true,
    },
  );

  return {
    data,
  };
};

export default useSemester;
