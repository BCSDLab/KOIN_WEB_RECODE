import { useSuspenseQuery } from '@tanstack/react-query';
import { timetable } from 'api';

export default function useAllMyLectures(token: string) {
  const { data } = useSuspenseQuery({
    queryKey: ['allLectures'],

    queryFn: () => (token ? timetable.getTimetableAllLectureInfo(token) : null),
  });

  return data ? data.timetable : null;
}
