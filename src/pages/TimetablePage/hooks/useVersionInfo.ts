import { timetable } from 'api';
import { useSuspenseQuery } from '@tanstack/react-query';

const useVersionInfo = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['timetable'],
    queryFn: () => timetable.getVersion('timetable'),
  });

  return {
    data,
  };
};

export default useVersionInfo;
