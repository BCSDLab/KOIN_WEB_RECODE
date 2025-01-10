import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timetable } from 'api';
import { Semester } from 'api/timetable/entity';
import useToast from 'components/common/Toast/useToast';
import { MY_SEMESTER_INFO_KEY } from './useMySemester';
import { TIMETABLE_FRAME_KEY } from './useTimetableFrameList';

export default function useDeleteSemester(token: string, semester: Semester) {
  const queryClient = useQueryClient();
  const slicedSemester = `${semester.year} ${semester.term}`;
  const toast = useToast();
  return useMutation({
    mutationFn: () => timetable.deleteSemester(token, semester),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MY_SEMESTER_INFO_KEY] });
      queryClient.invalidateQueries(
        { queryKey: [TIMETABLE_FRAME_KEY + semester!.year + semester!.term] },
      );
      toast.open({
        message: `선택하신 [${slicedSemester}]가 삭제되었습니다.`,
      });
    },
  });
}
