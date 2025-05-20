import { useQuery } from '@tanstack/react-query';
import { club } from 'api';

interface ClubListProps {
  categoryId?: number;
  hitSort?: boolean;
}

function useClubList({ categoryId, hitSort }: ClubListProps) {
  const { data } = useQuery(
    {
      queryKey: ['club-list', categoryId, hitSort],
      queryFn: () => club.getClubList(categoryId, hitSort),
    },
  );

  return data?.clubs ?? [];
}

export default useClubList;
