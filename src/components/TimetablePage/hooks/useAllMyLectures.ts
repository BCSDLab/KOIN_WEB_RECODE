import { useSuspenseQuery } from '@tanstack/react-query';
import { timetableQueries } from 'api/timetable/queries';

export default function useAllMyLectures(token: string) {
  const { data } = useSuspenseQuery(timetableQueries.allLectures(token));

  return data ? data.timetable : null;
}
