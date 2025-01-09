import { useSuspenseQuery } from '@tanstack/react-query';
import { timetable } from 'api';

export const TIMETABLE_FRAME_KEY = 'timetable_frame';

function useTimetableFrameList(token: string, semester: string) {
  const { data } = useSuspenseQuery({
    queryKey: [TIMETABLE_FRAME_KEY + semester],
    queryFn: async () => {
      if (token) {
        try {
          return await timetable.getTimetableFrame(token, semester);
        } catch (error) {
          return [{ id: null, timetable_name: '기본 시간표', is_main: true }];
        }
      } else {
        return [{ id: null, timetable_name: '기본 시간표', is_main: true }];
      }
    },
    staleTime: 0,
  });

  return { data };
}

export default useTimetableFrameList;
