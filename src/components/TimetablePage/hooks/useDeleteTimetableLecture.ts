import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timetableMutations } from 'api/timetable/mutations';
import { toast } from 'react-toastify';

export default function useDeleteTimetableLecture(authorization: string) {
  const queryClient = useQueryClient();
  const mutation = timetableMutations.deleteLecture(queryClient, authorization);

  return useMutation({
    ...mutation,
    onError: (error) => {
      if (isKoinError(error)) {
        if (error.status === 401) toast('로그인을 해주세요');
        if (error.status === 403) toast('강의 삭제에 실패했습니다.');
        if (error.status === 404) toast('강의 정보를 찾을 수 없습니다.');
      } else {
        sendClientError(error);
        toast('강의 삭제에 실패했습니다.');
      }
    },
  });
}
