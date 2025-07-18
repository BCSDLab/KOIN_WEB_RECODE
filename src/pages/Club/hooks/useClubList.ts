import { useQuery } from '@tanstack/react-query';
import { club } from 'api';

interface ClubListProps {
  token?: string;
  categoryId?: number;
  sortType?: string;
}

function useClubList({ token, categoryId, sortType }: ClubListProps) {
  const { data } = useQuery(
    {
      queryKey: ['club-list', categoryId, sortType],
      queryFn: () => club.getClubList(token, categoryId, sortType),
    },
  );

  return data?.clubs ?? [];
}

export default useClubList;
