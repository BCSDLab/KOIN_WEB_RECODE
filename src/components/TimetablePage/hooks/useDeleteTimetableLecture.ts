import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changeTimetableInfoByRemoveLecture } from 'api/timetable';
import { TIMETABLE_INFO_LIST } from './useTimetableInfoList';

export default function useDeleteTimetableLecture(semester: string, authorization: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Parameters<typeof changeTimetableInfoByRemoveLecture>[0],
    ) => changeTimetableInfoByRemoveLecture(authorization, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TIMETABLE_INFO_LIST, semester] });
    },
  });
}
