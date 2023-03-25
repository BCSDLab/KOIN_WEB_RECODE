import { useMutation, useQueryClient } from 'react-query';
import { changeTimeTableInfoByRemoveLecture } from 'api/timetable';
import { TIMETABLE_INFO_LIST } from './useTimetableInfoList';

export default function useDeleteTimetableLecture(semester: string, authorization: string) {
  const queryClient = useQueryClient();
  return useMutation(
    (
      data: Parameters<typeof changeTimeTableInfoByRemoveLecture>[0],
    ) => changeTimeTableInfoByRemoveLecture(
      data,
      authorization,
    ),
    {
      onSuccess: (data) => {
        queryClient.setQueryData(
          [
            TIMETABLE_INFO_LIST,
            semester,
          ],
          data,
        );
      },
    },
  );
}
