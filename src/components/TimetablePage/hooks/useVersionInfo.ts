import { useSuspenseQuery } from '@tanstack/react-query';
import { getVersion } from 'api/timetable';

const useVersionInfo = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['timetable'],
    queryFn: () => getVersion('timetable'),
  });

  return {
    data,
  };
};

export default useVersionInfo;
