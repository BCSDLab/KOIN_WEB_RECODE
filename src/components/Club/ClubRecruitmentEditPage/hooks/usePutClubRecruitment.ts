import { useRouter } from 'next/router';
import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clubMutations } from 'api/club/mutations';
import ROUTES from 'static/routes';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export default function usePutClubRecruitment(clubId: number) {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync } = useMutation({
    ...clubMutations.updateRecruitment(queryClient, token, clubId, {
      onSuccess: () => {
        showToast('success', '동아리 모집 수정 요청이 완료되었습니다.');
        router.push(ROUTES.ClubDetail({ id: String(clubId) }));
      },
    }),
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });
  return { mutateAsync };
}
