import { useQuery } from '@tanstack/react-query';
import { club } from 'api';

interface ClubListProps {
  token?: string;
  categoryId?: number;
  sortType?: string;
  isRecruiting?: boolean;
  query?: string;
}

function useClubList({
  token, categoryId, sortType, isRecruiting, query,
}: ClubListProps) {
  const { data } = useQuery(
    {
      queryKey: ['club-list', categoryId, sortType, isRecruiting, query],
      queryFn: () => club.getClubList(token, categoryId, sortType, isRecruiting, query),
    },
  );

  return data?.clubs ?? [];
}

export default useClubList;
