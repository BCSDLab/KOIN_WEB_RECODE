import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putClubDetail } from 'api/club';
import { NewClubData } from 'api/club/entity';
import { useRouter } from 'next/router';
import ROUTES from 'static/routes';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export default function usePutClub(clubId: number | string | undefined) {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  if (!clubId) {
    navigate('/clubs');
  }
  const { status, mutateAsync } = useMutation({
    mutationFn: async (data: NewClubData) => {
      await putClubDetail(token, data, clubId!);
    },
    onSuccess: () => {
      showToast('success', '동아리 정보 수정 요청이 완료되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['clubDetail'] });
      navigate(ROUTES.ClubDetail({ id: String(clubId), isLink: true }));
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });
  return { status, mutateAsync };
}
