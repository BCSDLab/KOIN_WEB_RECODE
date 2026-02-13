import { useSuspenseQuery } from '@tanstack/react-query';
import { getClubCategories } from 'api/club';

function useClubCategories() {
  const { data } = useSuspenseQuery({
    queryKey: ['club-categories'],
    queryFn: () => getClubCategories(),
  });
  return data.club_categories;
}

export default useClubCategories;
