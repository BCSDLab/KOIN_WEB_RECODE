import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Semester, TimetableFrameInfo } from 'api/timetable/entity';
import { timetableMutations } from 'api/timetable/mutations';
import useToast from 'components/feedback/Toast/useToast';
import showToast from 'utils/ts/showToast';
import { useSemester } from 'utils/zustand/semester';

import useRollbackTimetableFrame from './useRollbackTimetableFrame';

interface DeleteTimetableFrameOptions {
  semester?: Semester;
  /** 지정하면 복구 버튼 없이 이 메시지만 토스트로 보여준다. */
  plainMessage?: string;
}

export default function useDeleteTimetableFrame(
  isLoggedIn: boolean,
  frameInfo: TimetableFrameInfo,
  { semester: targetSemester, plainMessage }: DeleteTimetableFrameOptions = {},
) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const selectedSemester = useSemester();
  const semester = targetSemester ?? selectedSemester;
  const { mutate: rollbackFrame } = useRollbackTimetableFrame(isLoggedIn, semester);
  const recoverFrame = () => rollbackFrame(frameInfo.id!);
  const mutation = timetableMutations.deleteFrame(queryClient, isLoggedIn, semester);

  return useMutation({
    ...mutation,
    onSuccess: async (...args) => {
      await mutation.onSuccess?.(...args);
      if (plainMessage) {
        toast.open({ message: plainMessage });

        return;
      }
      toast.open({
        message: `선택하신 [${frameInfo.name}]이 삭제되었습니다.`,
        recoverMessage: `[${frameInfo.name}]이 복구되었습니다.`,
        onRecover: recoverFrame,
      });
    },

    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '시간표 프레임 삭제에 실패했습니다.');
      } else {
        sendClientError(error);
        showToast('error', '시간표 프레임 삭제에 실패했습니다.');
      }
    },
  });
}
