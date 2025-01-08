import { getAllEvent } from 'api/store';
import { useQuery } from '@tanstack/react-query';

export const useGetAllEvents = () => {
  const { data } = useQuery({
    queryKey: ['all-event'],
    queryFn: () => getAllEvent(),
  });

  return data?.events;
};
