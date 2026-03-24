import { useRouter } from 'next/router';
import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clubMutations } from 'api/club/mutations';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export default function useDeleteRecruitment() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const queryClient = useQueryClient();
  const token = useTokenState();

  return useMutation({
    ...clubMutations.deleteRecruitment(queryClient, token, Number(id), {
      onSuccess: () => {
        showToast('success', '모집이 삭제되었습니다.');
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
