import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteClubRecruitment } from 'api/club';
import { useParams } from 'react-router-dom';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export default function useDeleteRecruitment() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const token = useTokenState();

  return useMutation({
    mutationFn: () => deleteClubRecruitment(token, Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubRecruitment', id] });
      showToast('success', '모집이 삭제되었습니다.');
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
