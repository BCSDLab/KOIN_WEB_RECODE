import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timetable } from 'api';
import useToast from 'components/common/Toast/useToast';
import { MY_SEMESTER_INFO_KEY } from './useMySemester';
import useTimetableFrameList, { TIMETABLE_FRAME_KEY } from './useTimetableFrameList';

export default function useDeleteSemester(token: string, semester: string) {
  const queryClient = useQueryClient();
  const { data: timetableFrameList } = useTimetableFrameList(token, semester);
  const slicedSemester = `${semester.slice(0, 4)}년도 ${semester.slice(4)}학기`;
  const toast = useToast();
  return useMutation({
    mutationFn: async () => {
      if (timetableFrameList) {
        await Promise.all(timetableFrameList.map((frame) => (
          timetable.deleteTimetableFrame(token, frame.id!)
        )));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MY_SEMESTER_INFO_KEY] });
      queryClient.invalidateQueries({ queryKey: [TIMETABLE_FRAME_KEY + semester] });
      toast.open({
        message: `선택하신 [${slicedSemester}]가 삭제되었습니다.`,
      });
    },
  });
}
