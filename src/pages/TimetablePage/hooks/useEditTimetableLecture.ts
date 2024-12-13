import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editTimetableLecture } from 'api/timetable'; // API 함수 호출
import { toast } from 'react-toastify';
import { TIMETABLE_INFO_LIST } from './useTimetableInfoList';

export default function useEditTimetableLecture(authorization: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof editTimetableLecture>[0]) => (
      editTimetableLecture(data, authorization)
    ),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        [TIMETABLE_INFO_LIST, variables.timetable_frame_id],
        data,
      );
    },
    onError: (error) => {
      if (isKoinError(error)) {
        if (error.status === 401) toast('로그인을 해주세요');
        if (error.status === 403) toast('강의 수정에 실패했습니다.');
        if (error.status === 404) toast('강의 정보를 찾을 수 없습니다.');
      } else {
        sendClientError(error);
        toast('강의 수정에 실패했습니다.');
      }
    },
  });
}
