import { skipToken, useQuery } from '@tanstack/react-query';
import { getShuttleTimetableDetailInfo } from 'api/bus';

export default function useShuttleTimetableDetail(id: string | null) {
  const { data: shuttleTimetableDetail } = useQuery({
    queryKey: ['bus', 'shuttle', 'timetable', id],
    queryFn: id ? async () => getShuttleTimetableDetailInfo({ id }) : skipToken,
    staleTime: 1000 * 60 * 10,
  });

  return { shuttleTimetableDetail };
}
