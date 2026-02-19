import { useQuery } from '@tanstack/react-query';
import { getClubList } from 'api/club';

interface ClubListProps {
  token?: string;
  categoryId?: number;
  sortType?: string;
  isRecruiting?: boolean;
  clubName?: string;
}

function useClubList({ token, categoryId, sortType, isRecruiting, clubName }: ClubListProps) {
  const { data } = useQuery({
    queryKey: ['club-list', categoryId, sortType, isRecruiting, clubName],
    queryFn: () => getClubList(token, categoryId, sortType, isRecruiting, clubName),
  });

  return data?.clubs ?? [];
}

export default useClubList;
