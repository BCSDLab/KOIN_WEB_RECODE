import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putClubEvent } from 'api/club';
import { ClubEventRequest } from 'api/club/entity';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'static/routes';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export default function usePutClubEvent(clubId: number) {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync } = useMutation({
    mutationFn: async ({ eventId, data }: { eventId: number; data: ClubEventRequest }) => {
      await putClubEvent(token, clubId, eventId, data);
    },
    onSuccess: () => {
      showToast('success', '동아리 행사 수정 요청이 완료되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['clubDetail', 'clubEvent'] });
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
