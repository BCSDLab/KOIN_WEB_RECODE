import { useQuery } from '@tanstack/react-query';
import { club } from 'api';

interface ClubListProps {
  token?: string;
  categoryId?: number;
  hitSort?: string;
}

function useClubList({ token, categoryId, hitSort }: ClubListProps) {
  const { data } = useQuery(
    {
      queryKey: ['club-list', categoryId, hitSort],
      queryFn: () => club.getClubList(token, categoryId, hitSort),
    },
  );

  return data?.clubs ?? [];
}

export default useClubList;
