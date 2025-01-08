import { getShuttleTimetableDetailInfo } from 'api/bus';
import { skipToken, useQuery } from '@tanstack/react-query';

function useShuttleTimetableDetail(id: string | null) {
  const { data: shuttleTimetableDetail } = useQuery({
    queryKey: ['bus', 'shuttle', 'timetable', id],
    queryFn: id ? async () => getShuttleTimetableDetailInfo({ id }) : skipToken,
    enabled: !!id,
  });

  return { shuttleTimetableDetail };
}

export default useShuttleTimetableDetail;
