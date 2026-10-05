import { useRouter } from 'next/router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { clubQueries } from 'api/club/queries';
import useTokenState from 'utils/hooks/state/useTokenState';

interface ClubEventListProps {
  clubId: string | number | undefined;
  eventType: 'RECENT' | 'ONGOING' | 'UPCOMING' | 'ENDED';
}

export function useClubEventList({ clubId, eventType }: ClubEventListProps) {
  const token = useTokenState();
  const router = useRouter();

  if (!clubId) {
    router.push('/clubs');
  }
  const { data: clubEventList } = useSuspenseQuery(clubQueries.eventList(clubId!, eventType, token));

  return { clubEventList };
}

export function useClubEventDetail(clubId: string | number | undefined, eventId: string | number | undefined) {
  const router = useRouter();

  if (!clubId) {
    router.push('/clubs');
  }

  const { data: clubEventDetail } = useSuspenseQuery(clubQueries.eventDetail(clubId!, eventId!));

  return { clubEventDetail };
}
