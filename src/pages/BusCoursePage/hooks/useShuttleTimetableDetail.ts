import { skipToken, useQuery } from '@tanstack/react-query';
import { getShuttleTimetableDetailInfo } from 'api/bus';

function useShuttleTimetableDetail(id: string | null) {
  const { data: shuttleTimetableDetail } = useQuery({
    queryKey: ['bus', 'shuttle', 'timetable', id],
    queryFn: id ? async () => getShuttleTimetableDetailInfo({ id }) : skipToken,
    enabled: !!id,
  });

  return { shuttleTimetableDetail };
}

export default useShuttleTimetableDetail;
