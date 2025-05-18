import { useSuspenseQuery } from '@tanstack/react-query';
import { club } from 'api';

function useHotClubs() {
  const data = useSuspenseQuery(
    {
      queryKey: ['hot-club'],
      queryFn: () => club.getHotClub(),
    },
  );
  return data;
}

export default useHotClubs;
