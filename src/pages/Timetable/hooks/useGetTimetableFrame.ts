import { useSuspenseQuery } from '@tanstack/react-query';
import { timetable } from 'api';

const MY_TIMETABLE_FRAME_KEY = 'my_timetable_frame';

function useGetTimetableFrame(token: string, semester: string) {
  const { data } = useSuspenseQuery(
    {
      queryKey: [MY_TIMETABLE_FRAME_KEY + semester],
      queryFn: () => (token ? timetable.getTimetableFrame(token, semester) : null),
    },
  );

  return { data };
}

export default useGetTimetableFrame;
