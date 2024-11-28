import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changeTimetableInfoByAddLecture } from 'api/timetable';
import { toast } from 'react-toastify';
import { TIMETABLE_INFO_LIST } from './useTimetableInfoList';

export default function useAddTimetableLecture(token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Parameters<typeof changeTimetableInfoByAddLecture>[0],
    ) => changeTimetableInfoByAddLecture(data, token),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        [
          TIMETABLE_INFO_LIST,
          variables.timetable_frame_id,
        ],
        data,
      );
    },
    onError: (error) => {
      if (isKoinError(error)) {
        if (error.status === 401) toast('로그인을 해주세요');
        if (error.status === 403) toast('시간표 추가에 실패했습니다.');
        if (error.status === 404) toast('강의 정보를 찾을 수 없습니다.');
      } else {
        sendClientError(error);
        toast('시간표 추가에 실패했습니다.');
      }
    },
  });
}
