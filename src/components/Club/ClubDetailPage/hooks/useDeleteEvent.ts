import { useRouter } from 'next/router';

import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clubMutations } from 'api/club/mutations';
import showToast from 'utils/ts/showToast';

export default function useDeleteEvent() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const queryClient = useQueryClient();

  return useMutation({
    ...clubMutations.deleteEvent(queryClient, Number(id), {
      onSuccess: () => {
        showToast('success', '행사 삭제되었습니다.');
      },
    }),
    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message);
      } else {
        sendClientError(error);
      }
    },
  });
}
