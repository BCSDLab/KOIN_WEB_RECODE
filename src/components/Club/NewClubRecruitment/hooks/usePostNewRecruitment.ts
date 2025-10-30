import { useRouter } from 'next/router';
import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postClubRecruitment } from 'api/club';
import { ClubRecruitmentRequest } from 'api/club/entity';
import ROUTES from 'static/routes';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export default function usePostNewRecruitment(clubId: number | undefined) {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync } = useMutation({
    mutationFn: async (data: ClubRecruitmentRequest) => {
      const response = await postClubRecruitment(token, clubId!, data);
      return response;
    },
    onSuccess: () => {
      showToast('success', '동아리 모집이 생성되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['clubRecruitment'] });
      router.push(ROUTES.ClubDetail({ id: String(clubId), isLink: true }));
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });
  return { mutateAsync };
}
