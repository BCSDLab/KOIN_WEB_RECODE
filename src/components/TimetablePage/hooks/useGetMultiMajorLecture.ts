import { useSuspenseQuery } from '@tanstack/react-query';
import { timetable } from 'api';

export default function useGetMultiMajorLecture(token: string) {
  return useSuspenseQuery({
    queryKey: ['allLectures'],

    queryFn: () => (token ? timetable.getTimetableAllLectureInfo(token) : null),

    select: (data) => (data ? data.timetable.filter((item) => item.course_type === '다전공') : null),
  });
}
