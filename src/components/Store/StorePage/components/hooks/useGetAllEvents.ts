import { useSuspenseQuery } from '@tanstack/react-query';
import { getAllEvent } from 'api/store';

export const useGetAllEvents = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['all-event'],
    queryFn: () => getAllEvent(),
  });

  return { events: data.events };
};
