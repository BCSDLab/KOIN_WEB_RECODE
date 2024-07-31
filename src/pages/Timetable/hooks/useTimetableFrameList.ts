import { useQuery } from '@tanstack/react-query';
import { timetable } from 'api';

export const TIMETABLE_FRAME_KEY = 'timetable_frame';

function useTimetableFrameList(token: string, semester: string) {
  const { data } = useQuery(
    {
      queryKey: [TIMETABLE_FRAME_KEY + semester],
      queryFn: () => (token
        ? timetable.getTimetableFrame(token, semester)
        : [{ id: 1, timetable_name: '기본 시간표', is_main: true }]
      ),
    },
  );

  return { data };
}

export default useTimetableFrameList;
