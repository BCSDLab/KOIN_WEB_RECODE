import { useQuery } from '@tanstack/react-query';
import { timetable } from 'api';

export const SEMESTER_INFO_KEY = 'frame';

const useFrameList = (authorization: string, semester: string) => {
  const { data } = useQuery(
    {
      queryKey: [SEMESTER_INFO_KEY, semester + authorization],
      queryFn: () => (semester !== '' ? timetable.getFrame(authorization, semester) : null),
    },
  );
  return { data };
};

export default useFrameList;
