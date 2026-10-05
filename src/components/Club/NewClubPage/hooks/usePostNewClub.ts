import { useRouter } from 'next/router';
import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clubMutations } from 'api/club/mutations';
import ROUTES from 'static/routes';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export default function usePostNewClub() {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { status, mutateAsync } = useMutation({
    ...clubMutations.create(queryClient, token, {
      onSuccess: () => {
        showToast('success', '동아리 생성 요청이 완료되었습니다.');
        router.push(ROUTES.Club());
      },
    }),
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });
  return { status, mutateAsync };
}
