import { timetable } from 'api';
import { useQuery } from 'react-query';

const VERSION_INFO_KEY = 'timetable';

const useVersionInfo = () => {
  const { data } = useQuery(
    VERSION_INFO_KEY,
    ({ queryKey }) => timetable.getVersion(queryKey[0]),
    {
      suspense: true,
      useErrorBoundary: false,
    },
  );

  return {
    data,
  };
};

export default useVersionInfo;
