import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTimetableLectureRegular } from 'api/timetable';
import showToast from 'utils/ts/showToast';
import { TIMETABLE_INFO_LIST } from './useTimetableInfoList';

export default function useAddTimetableLectureRegular(token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Parameters<typeof addTimetableLectureRegular>[0],
    ) => addTimetableLectureRegular(data, token),
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
        if (error.status === 401) showToast('error', '로그인을 해주세요');
        if (error.status === 403) showToast('error', '시간표 추가에 실패했습니다.');
        if (error.status === 404) showToast('error', '강의 정보를 찾을 수 없습니다.');
      } else {
        sendClientError(error);
        showToast('error', '시간표 추가에 실패했습니다.');
      }
    },
  });
}
