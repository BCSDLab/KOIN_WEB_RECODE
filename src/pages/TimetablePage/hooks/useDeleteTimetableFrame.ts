import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timetable } from 'api';
import { TimetableFrameInfo } from 'api/timetable/entity';
import useToast from 'components/Toast/useToast';
import showToast from 'utils/ts/showToast';
import { useSemester } from 'utils/zustand/semester';
import useRollbackTimetableFrame from './useRollbackTimetableFrame';
import { TIMETABLE_FRAME_KEY } from './useTimetableFrameList';

type DeleteTimetableFrameProps = {
  id: number,
};

export default function useDeleteTimetableFrame(token: string, frameInfo: TimetableFrameInfo) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const semester = useSemester();
  const { mutate: rollbackFrame } = useRollbackTimetableFrame(token);
  const recoverFrame = () => rollbackFrame(frameInfo.id!);

  return useMutation({
    mutationFn: ({ id }: DeleteTimetableFrameProps) => timetable.deleteTimetableFrame(token, id),

    onSuccess: () => {
      queryClient.invalidateQueries(
        { queryKey: [TIMETABLE_FRAME_KEY + semester.year + semester.term] },
      );
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
