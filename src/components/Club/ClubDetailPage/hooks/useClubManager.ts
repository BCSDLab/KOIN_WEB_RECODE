import { useRouter } from 'next/router';

import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clubMutations } from 'api/club/mutations';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import showToast from 'utils/ts/showToast';

export default function useMandateClubManagerMutation(clubId: number | string | undefined) {
  const router = useRouter();
  const logger = useLogger();
  if (!clubId) {
    router.push(ROUTES.Club());
  }
  const queryClient = useQueryClient();
  const { status: mandateClubManagerStatus, mutateAsync: mandateClubManagerMutateAsync } = useMutation({
    ...clubMutations.mandateManager(queryClient, Number(clubId), {
      onSuccess: () => {
        logger.actionEventClick({
          team: 'CAMPUS',
          event_label: 'club_delegation_authority_confirm',
          value: '권한위임',
        });
      },
    }),
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  return {
    mandateClubManagerStatus,
    mandateClubManagerMutateAsync,
  };
}
