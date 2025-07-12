import { useSuspenseQuery } from '@tanstack/react-query';
import { getClubEventDetail, getClubEventList } from 'api/club';
import { useNavigate } from 'react-router-dom';

export function useClubEventList(clubId: string | number | undefined, eventType: 'RECENT' | 'ONGOING' | 'UPCOMING' | 'ENDED') {
  const navigate = useNavigate();

  if (!clubId) {
    navigate('/clubs');
  }
  const { data: clubEventList } = useSuspenseQuery({
    queryKey: ['clubEventList', clubId, eventType],
    queryFn: async () => getClubEventList(clubId!, eventType),
  });

  return { clubEventList };
}

export function useClubEventDetail(
  clubId: string | number | undefined,
  eventId: string | number | undefined,
) {
  const navigate = useNavigate();

  if (!clubId) {
    navigate('/clubs');
  }

  const { data: clubEventDetail } = useSuspenseQuery({
    queryKey: ['clubEventDetail', clubId, eventId],
    queryFn: async () => getClubEventDetail(clubId!, eventId!),
  });

  return { clubEventDetail };
}
