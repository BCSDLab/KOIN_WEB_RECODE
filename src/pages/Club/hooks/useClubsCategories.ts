import { useSuspenseQuery } from '@tanstack/react-query';
import { club } from 'api';

function useClubsCategories() {
  const { data } = useSuspenseQuery(
    {
      queryKey: ['club-categories'],
      queryFn: () => club.getClubCategories(),
    },
  );
  return data.club_categories;
}

export default useClubsCategories;
