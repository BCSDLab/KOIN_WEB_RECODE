import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteClubEvent } from 'api/club';
import { useRouter } from 'next/router';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export default function useDeleteEvent() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const queryClient = useQueryClient();
  const token = useTokenState();

  return useMutation({
    mutationFn: (eventId: number) => deleteClubEvent(token, Number(id), eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubEventList', id] });
      showToast('success', '행사 삭제되었습니다.');
    },
    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message);
      } else {
        sendClientError(error);
      }
    },
  });
}
