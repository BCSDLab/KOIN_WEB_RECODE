import { timetable } from 'api';
import { useQuery } from 'react-query';

const LASTUPDATED_INFO_KEY = 'timetable';

const useLastUpdatedDate = () => {
  const { data } = useQuery(
    LASTUPDATED_INFO_KEY,
    ({ queryKey }) => timetable.getLastUpdatedDate(queryKey[0] ?? 'timetable'),
    {
      suspense: true,
      useErrorBoundary: false,
    },
  );

  return {
    data,
  };
};

export default useLastUpdatedDate;
