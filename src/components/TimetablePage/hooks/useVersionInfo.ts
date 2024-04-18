import { useSuspenseQuery } from '@tanstack/react-query';
import { timetable } from 'api';

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
