import { useSuspenseQuery } from '@tanstack/react-query';
import { club } from 'api';

function useHotClub() {
  const data = useSuspenseQuery(
    {
      queryKey: ['hot-club'],
      queryFn: () => club.getHotClub(),
    },
  );
  return data;
}

export default useHotClub;
