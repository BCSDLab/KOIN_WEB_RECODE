import { useSuspenseQuery } from '@tanstack/react-query';
import { timetable } from 'api';

export default function useTakenLectureCode(token: string) {
  return useSuspenseQuery({
    queryKey: ['allLectures'],

    queryFn: () => timetable.getTimetableAllLectureInfo(token),

    select: (data) => ({
      code: data.timetable.map((item) => item.code),
      multiMajor: data.timetable.filter((item) => item.course_type === '다전공'),
    }),
  });
}
