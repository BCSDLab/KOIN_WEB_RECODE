import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putNewClubManager } from 'api/club';
import { NewClubManager } from 'api/club/entity';
import { useNavigate } from 'react-router-dom';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export default function useMandateClubManagerMutation(clubId: number | string | undefined) {
  const navigate = useNavigate();
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
