import { useSuspenseQuery } from '@tanstack/react-query';
import { Semester } from 'api/timetable/entity';
import { timetableQueries } from 'api/timetable/queries';

const useLectureList = (semesterKey: Semester) => {
  const { data } = useSuspenseQuery(timetableQueries.lectureList(semesterKey));
  return { data };
};

export default useLectureList;
