import { getAllEvent } from 'api/store';
import { useQuery } from 'react-query';

export const useGetAllEvents = () => {
  const { data } = useQuery({
    queryKey: 'all-event',
    queryFn: () => getAllEvent(),
  });

  return data?.events;
};
