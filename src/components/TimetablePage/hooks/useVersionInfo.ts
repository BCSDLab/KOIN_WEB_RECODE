import { useSuspenseQuery } from '@tanstack/react-query';
import { timetableQueries } from 'api/timetable/queries';

const useVersionInfo = () => {
  const { data } = useSuspenseQuery(timetableQueries.version('timetable'));

  return {
    data,
  };
};

export default useVersionInfo;
