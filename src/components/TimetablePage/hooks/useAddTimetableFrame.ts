import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Semester } from 'api/timetable/entity';
import { timetableMutations } from 'api/timetable/mutations';
import showToast from 'utils/ts/showToast';
import { useSemester } from 'utils/zustand/semester';

/** targetSemester가 없으면 선택된 학기의 목록을 갱신한다. */
export default function useAddTimetableFrame(isLoggedIn: boolean, targetSemester?: Semester) {
  const queryClient = useQueryClient();
  const selectedSemester = useSemester();
  const mutation = timetableMutations.addFrame(queryClient, isLoggedIn, targetSemester ?? selectedSemester);

  return useMutation({
    ...mutation,
    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '시간표 프레임 추가에 실패했습니다.');
      } else {
        sendClientError(error);
        showToast('error', '시간표 프레임 추가에 실패했습니다.');
      }
    },
  });
}
