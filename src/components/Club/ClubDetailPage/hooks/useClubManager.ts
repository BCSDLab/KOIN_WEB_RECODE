import { useRouter } from 'next/router';
import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clubMutations } from 'api/club/mutations';
import useLogger from 'utils/hooks/analytics/useLogger';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export default function useMandateClubManagerMutation(clubId: number | string | undefined) {
  const router = useRouter();
  const logger = useLogger();
  if (!clubId) {
    router.push('/clubs');
  }
  const token = useTokenState();
  const queryClient = useQueryClient();
  const { status: mandateClubManagerStatus, mutateAsync: mandateClubManagerMutateAsync } = useMutation({
    ...clubMutations.mandateManager(queryClient, token, Number(clubId), {
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
