import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postClub } from 'api/club';
import { NewClubData } from 'api/club/entity';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'static/routes';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export default function usePostNewClub() {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { status, mutateAsync } = useMutation({
    mutationFn: async (data: NewClubData) => {
      await postClub(token, data);
    },
    onSuccess: () => {
      showToast('success', '동아리 생성 요청이 완료되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['clubList'] });
      navigate(ROUTES.Club());
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });
  return { status, mutateAsync };
}
