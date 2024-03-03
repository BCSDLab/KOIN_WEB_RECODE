import { useMutation, useQueryClient } from 'react-query';
import { changeTimetableInfoByRemoveLecture } from 'api/timetable';
import { TIMETABLE_INFO_LIST } from './useTimetableInfoList';

export default function useDeleteTimetableLecture(semester: string, authorization: string) {
  const queryClient = useQueryClient();
  return useMutation(
    (
      data: Parameters<typeof changeTimetableInfoByRemoveLecture>[0],
    ) => changeTimetableInfoByRemoveLecture(
      authorization,
      data,
    ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          [
            TIMETABLE_INFO_LIST,
            semester,
          ],
        );
      },
    },
  );
}
