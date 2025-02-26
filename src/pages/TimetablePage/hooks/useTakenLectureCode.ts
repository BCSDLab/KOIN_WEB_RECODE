import { useSuspenseQuery } from '@tanstack/react-query';
import { timetable } from 'api';

export default function useTakenLectureCode(token: string) {
  return useSuspenseQuery({
    queryKey: ['allLectures'],

    queryFn: () => timetable.getTimetableAllLectureInfo(token),

    select: (data) => data.timetable.map((item) => item.code),
  });
}
