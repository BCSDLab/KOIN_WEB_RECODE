import { timetable } from 'api';
import { useSuspenseQuery } from '@tanstack/react-query';

const SEMESTER_INFO_KEY = 'lecture';

const useLectureList = (semesterKey: string) => {
  const { data } = useSuspenseQuery({
    queryKey: [SEMESTER_INFO_KEY, semesterKey],
    queryFn: () => (semesterKey !== '' ? timetable.getLectureList(semesterKey) : null),
  });
  return { data };
};

export default useLectureList;
