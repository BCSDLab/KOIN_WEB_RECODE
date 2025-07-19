import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putNewClubManager } from 'api/club';
import { NewClubManager } from 'api/club/entity';
import { useNavigate } from 'react-router-dom';
import useLogger from 'utils/hooks/analytics/useLogger';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export default function useMandateClubManagerMutation(clubId: number | string | undefined) {
  const navigate = useNavigate();
  const logger = useLogger();
  if (!clubId) {
    navigate('/clubs');
  }
  const token = useTokenState();
  const queryClient = useQueryClient();
  const {
    status: mandateClubManagerStatus,
    mutateAsync: mandateClubManagerMutateAsync,
  } = useMutation({
    mutationFn: async (data:NewClubManager) => {
      await putNewClubManager(token, data);
    },
    onSuccess: () => {
      logger.actionEventClick({
        team: 'CAMPUS',
        event_label: 'club_delegation_authority_confirm',
        value: '권한위임',
      });
      queryClient.invalidateQueries({ queryKey: ['clubDetail'] });
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  return {
    mandateClubManagerStatus, mandateClubManagerMutateAsync,
  };
}
