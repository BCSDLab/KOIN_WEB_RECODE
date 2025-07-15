import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postClubEvent } from 'api/club';
import { ClubEventRequest } from 'api/club/entity';
import { isKoinError, sendClientError } from '@bcsdlab/koin';
import ROUTES from 'static/routes';
import showToast from 'utils/ts/showToast';
import useTokenState from 'utils/hooks/state/useTokenState';

export default function usePostNewEvent(clubId: number | undefined) {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync } = useMutation({
    mutationFn: async (data: ClubEventRequest) => {
      const response = await postClubEvent(token, clubId!, data);
      return response;
    },
    onSuccess: () => {
      showToast('success', '동아리 행사가 생성되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['clubList'] });
      navigate(ROUTES.ClubDetail({ id: String(clubId), isLink: true }));
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });
  return { mutateAsync };
}
