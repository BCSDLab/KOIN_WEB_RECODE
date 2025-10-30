import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editTimetableFrame } from 'api/timetable';
import { TimetableFrameInfo } from 'api/timetable/entity';
import showToast from 'utils/ts/showToast';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useSemester } from 'utils/zustand/semester';
import { TIMETABLE_FRAME_KEY } from './useTimetableFrameList';

export default function useUpdateTimetableFrame() {
  const token = useTokenState();

  const queryClient = useQueryClient();
  const semester = useSemester();
  const mutate = useMutation({
    mutationFn: (frameInfo: TimetableFrameInfo) =>
      editTimetableFrame(token, frameInfo.id!, { name: frameInfo.name, is_main: frameInfo.is_main }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TIMETABLE_FRAME_KEY + semester.year + semester.term] });
    },
    onError: (error) => {
      if (isKoinError(error)) {
        if (error.status === 400) showToast('error', error.message || '올바른 값을 입력해주세요.');
        if (error.status === 401) showToast('error', error.message || '로그인을 해주세요');
        if (error.status === 403) showToast('error', error.message || '시간표 프레임 수정에 실패했습니다.');
        if (error.status === 404) showToast('error', error.message || '시간표 프레임 정보를 찾을 수 없습니다.');
      } else {
        sendClientError(error);
        showToast('error', '시간표 프레임 수정에 실패했습니다.');
      }
    },
  });

  return mutate;
}
