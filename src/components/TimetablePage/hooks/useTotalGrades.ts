import { useSuspenseQuery } from '@tanstack/react-query';
import { timetableQueries } from 'api/timetable/queries';
import useTokenState from 'utils/hooks/state/useTokenState';

export default function useTotalGrades(timetableFrameId: number) {
  const token = useTokenState();

  return useSuspenseQuery({
    ...timetableQueries.lectureInfo(token, timetableFrameId),
    select: (data) => data?.total_grades,
  });
}
