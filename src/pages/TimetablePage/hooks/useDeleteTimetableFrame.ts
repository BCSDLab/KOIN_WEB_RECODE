import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timetable } from 'api';
import { TimetableFrameInfo } from 'api/timetable/entity';
import useToast from 'components/common/Toast/useToast';
import useAddTimetableFrame from './useAddTimetableFrame';
import useAddTimetableLectureV2 from './useAddTimetableLectureV2';
import { TIMETABLE_FRAME_KEY } from './useTimetableFrameList';

type DeleteTimetableFrameProps = {
  id: number,
  frame: TimetableFrameInfo,
};

export default function useDeleteTimetableFrame(token: string, semester: string) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { mutateAsync: addTimetableFrame } = useAddTimetableFrame(token);
  const { mutate: mutateAddWithServer } = useAddTimetableLectureV2(token);
  const recoverFrame = async () => {
    const restoredFrame = JSON.parse(sessionStorage.getItem('restoreFrame')!);
    const restoredLectures = JSON.parse(sessionStorage.getItem('restoreLecturesInFrame')!);
    const newTimetableFrame = await addTimetableFrame(
      { semester, timetable_name: restoredFrame.timetable_name },
    );
    mutateAddWithServer({
      timetable_frame_id: newTimetableFrame.id!,
      timetable_lecture: restoredLectures.myLecturesV2,
    });
  };

  return useMutation({
    mutationFn: ({ id, frame }: DeleteTimetableFrameProps) => {
      sessionStorage.setItem('restoreFrame', JSON.stringify(frame));
      return timetable.deleteTimetableFrame(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TIMETABLE_FRAME_KEY + semester] });
      const restoredFrame = JSON.parse(sessionStorage.getItem('restoreFrame')!);
      toast.open({
        message: `선택하신 [${restoredFrame.timetable_name}]이 삭제되었습니다.`,
        recoverMessage: `[${restoredFrame.timetable_name}]이 복구되었습니다.`,
        onRecover: recoverFrame,
      });
    },
  });
}
