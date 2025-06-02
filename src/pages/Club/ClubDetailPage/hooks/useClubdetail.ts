import { useSuspenseQuery } from '@tanstack/react-query';
import { getClubDetail } from 'api/club';
import { useNavigate } from 'react-router-dom';

export default function useClubDetail(clubId: number | string | undefined) {
  const navigate = useNavigate();
  if (!clubId) {
    navigate('/clubs');
  }
  const { data: clubDetail } = useSuspenseQuery({
    queryKey: ['club', 'detail', clubId],
    queryFn: () => getClubDetail(Number(clubId)),
  });

  return {
    clubDetail,
  };
}
