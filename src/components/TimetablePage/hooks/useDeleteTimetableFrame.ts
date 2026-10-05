import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TimetableFrameInfo } from 'api/timetable/entity';
import { timetableMutations } from 'api/timetable/mutations';
import useToast from 'components/feedback/Toast/useToast';
import showToast from 'utils/ts/showToast';
import { useSemester } from 'utils/zustand/semester';
import useRollbackTimetableFrame from './useRollbackTimetableFrame';

export default function useDeleteTimetableFrame(token: string, frameInfo: TimetableFrameInfo) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const semester = useSemester();
  const { mutate: rollbackFrame } = useRollbackTimetableFrame(token);
  const recoverFrame = () => rollbackFrame(frameInfo.id!);
  const mutation = timetableMutations.deleteFrame(queryClient, token, semester);

  return useMutation({
    ...mutation,
    onSuccess: async (...args) => {
      await mutation.onSuccess?.(...args);
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
