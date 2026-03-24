import { useSuspenseQuery } from '@tanstack/react-query';
import { timetableQueries } from 'api/timetable/queries';

export default function useGetMultiMajorLecture(token: string) {
  return useSuspenseQuery({
    ...timetableQueries.allLectures(token),
    select: (data) => (data ? data.timetable.filter((item) => item.course_type === '다전공') : null),
  });
}
