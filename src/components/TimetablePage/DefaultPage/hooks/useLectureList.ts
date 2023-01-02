import { timetable } from 'api';
import { useQuery } from 'react-query';
const SEMESTER_INFO_KEY = 'lecture';

const useLectureList = (semesterKey: string | null) => {
  const { data, status } = useQuery(
    [SEMESTER_INFO_KEY, semesterKey],
    ({ queryKey }) => timetable.getLectureList(queryKey[1] ?? '20191'),
    {
      suspense: true,
      useErrorBoundary: false,
      enabled: !!semesterKey,
    },
  );

  return {
    data,
    status,
  };
};

export default useLectureList;
