import { useRouter } from 'next/router';

import { useSuspenseQuery } from '@tanstack/react-query';
import { clubQueries } from 'api/club/queries';
import ROUTES from 'static/routes';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';

interface ClubEventListProps {
  clubId: string | number | undefined;
  eventType: 'RECENT' | 'ONGOING' | 'UPCOMING' | 'ENDED';
}

export function useClubEventList({ clubId, eventType }: ClubEventListProps) {
  const isLoggedIn = useIsLoggedIn();
  const router = useRouter();

  if (!clubId) {
    router.push(ROUTES.Club());
  }
  const { data: clubEventList } = useSuspenseQuery(clubQueries.eventList(clubId!, eventType, isLoggedIn));

  return { clubEventList };
}

export function useClubEventDetail(clubId: string | number | undefined, eventId: string | number | undefined) {
  const router = useRouter();

  if (!clubId) {
    router.push(ROUTES.Club());
  }

  const { data: clubEventDetail } = useSuspenseQuery(clubQueries.eventDetail(clubId!, eventId!));

  return { clubEventDetail };
}
