import { isKoinError } from '@bcsdlab/koin';
import { useSuspenseQuery } from '@tanstack/react-query';
import { club } from 'api';

function useHotClub() {
  const data = useSuspenseQuery(
    {
      queryKey: ['hot-club'],
      queryFn: async () => {
        try {
          return await club.getHotClub();
        } catch (e) {
          if (isKoinError(e) && e.status === 404) {
            return {
              club_id: -1,
              name: '인기 동아리가 없어요',
              image_url: '',
            };
          }
          throw e;
        }
      },

    },
  );
  return data;
}

export default useHotClub;
