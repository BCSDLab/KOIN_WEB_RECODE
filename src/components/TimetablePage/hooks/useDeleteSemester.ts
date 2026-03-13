import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Semester } from 'api/timetable/entity';
import { timetableMutations } from 'api/timetable/mutations';
import useToast from 'components/feedback/Toast/useToast';
import showToast from 'utils/ts/showToast';

export default function useDeleteSemester(token: string, semester: Semester) {
  const queryClient = useQueryClient();
  const slicedSemester = `${semester.year} ${semester.term}`;
  const toast = useToast();
  const mutation = timetableMutations.deleteSemester(queryClient, token, semester);
  return useMutation({
    ...mutation,
    onSuccess: async (...args) => {
      await mutation.onSuccess?.(...args);
      toast.open({
        message: `선택하신 [${slicedSemester}]가 삭제되었습니다.`,
      });
    },
    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '학기 삭제에 실패했습니다.');
      } else {
        sendClientError(error);
        showToast('error', '학기 삭제에 실패했습니다.');
      }
    },
  });
}
