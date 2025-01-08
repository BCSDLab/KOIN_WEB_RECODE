import { useQuery } from '@tanstack/react-query';
import { getAllEvent } from 'api/store';

export const useGetAllEvents = () => {
  const { data } = useQuery({
    queryKey: ['all-event'],
    queryFn: () => getAllEvent(),
  });

  return data?.events;
};
