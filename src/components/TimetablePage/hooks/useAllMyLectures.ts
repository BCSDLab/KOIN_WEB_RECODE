import { useSuspenseQuery } from '@tanstack/react-query';
import { getTimetableAllLectureInfo } from 'api/timetable';

export default function useAllMyLectures(token: string) {
  const { data } = useSuspenseQuery({
    queryKey: ['allLectures'],

    queryFn: () => (token ? getTimetableAllLectureInfo(token) : null),
  });

  return data ? data.timetable : null;
}
