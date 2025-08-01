import { useSuspenseQuery } from '@tanstack/react-query';
import { timetable } from 'api';
import { Semester } from 'api/timetable/entity';
import { useTokenStore } from 'utils/zustand/auth';

export const TIMETABLE_FRAME_KEY = 'timetable_frame';

function useTimetableFrameList(token: string, semester: Semester) {
  const { userType } = useTokenStore();
  const { data } = useSuspenseQuery(
    {
      queryKey: [TIMETABLE_FRAME_KEY + semester.year + semester.term],
      queryFn: async () => {
        if (token && userType === 'STUDENT') {
          try {
            return await timetable.getTimetableFrame(token, semester);
          } catch (error) {
            return [{ id: null, name: '기본 시간표', is_main: true }];
          }
        } else {
          return [{ id: null, name: '기본 시간표', is_main: true }];
        }
      },
    },
  );

  return { data };
}

export default useTimetableFrameList;
