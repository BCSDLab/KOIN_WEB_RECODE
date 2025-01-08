import { useSuspenseQuery } from '@tanstack/react-query';
import { Semester } from 'api/timetable/entity';
import { timetable } from 'api';

const SEMESTER_INFO_KEY = 'lecture';

const useLectureList = (semesterKey: Semester) => {
  const { data } = useSuspenseQuery(
    {
      queryKey: [SEMESTER_INFO_KEY, semesterKey],
      queryFn: () => (semesterKey ? timetable.getLectureList(semesterKey) : null),
    },
  );
  return { data };
};

export default useLectureList;
