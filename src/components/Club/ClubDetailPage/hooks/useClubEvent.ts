import { useSuspenseQuery } from '@tanstack/react-query';
import { getClubEventDetail, getClubEventList } from 'api/club';
import { useRouter } from 'next/router';

export function useClubEventList(clubId: string | number | undefined, eventType: 'RECENT' | 'ONGOING' | 'UPCOMING' | 'ENDED') {
  const router = useRouter();

  if (!clubId) {
    router.push('/clubs');
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
  const router = useRouter();

  if (!clubId) {
    router.push('/clubs');
  }

  const { data: clubEventDetail } = useSuspenseQuery({
    queryKey: ['clubEventDetail', clubId, eventId],
    queryFn: async () => getClubEventDetail(clubId!, eventId!),
  });

  return { clubEventDetail };
}
