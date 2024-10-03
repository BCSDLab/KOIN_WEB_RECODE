import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changeTimetableInfoByRemoveLectureV2 } from 'api/timetable';
import { toast } from 'react-toastify';
import { TIMETABLE_INFO_LIST } from './useTimetableV2InfoList';

export default function useDeleteTimetableLectureV2(authorization: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => changeTimetableInfoByRemoveLectureV2(authorization, id),
    onSuccess: () => {
      queryClient.invalidateQueries(
        { queryKey: [TIMETABLE_INFO_LIST] },
      );
    },
    onError: (error) => {
      if (isKoinError(error)) {
        if (error.status === 401) toast('로그인을 해주세요');
        if (error.status === 403) toast('시간표 삭제에 실패했습니다.');
        if (error.status === 404) toast('강의 정보를 찾을 수 없습니다.');
      } else {
        sendClientError(error);
        toast('시간표 삭제에 실패했습니다.');
      }
    },
  });
}
