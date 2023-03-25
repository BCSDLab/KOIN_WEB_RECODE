import { useMutation, useQueryClient } from 'react-query';
import { changeTimeTableInfoByAddLecture } from 'api/timetable';
import { TIMETABLE_INFO_LIST } from './useTimetableInfoList';

export default function useAddTimetableLecture(authorization: string) {
  const queryClient = useQueryClient();
  return useMutation(
    (
      data: Parameters<typeof changeTimeTableInfoByAddLecture>[0],
    ) => changeTimeTableInfoByAddLecture(
      data,
      authorization,
    ),
    {
      onSuccess: (data, variables) => {
        queryClient.setQueryData(
          [
            TIMETABLE_INFO_LIST,
            variables.semester,
          ],
          data,
        );
      },
    },
  );
}
