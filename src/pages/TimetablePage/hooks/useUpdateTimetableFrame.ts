import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTimetableFrame } from 'api/timetable';
import { TimetableFrameInfo } from 'api/timetable/entity';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useSemester } from 'utils/zustand/semester';
import { TIMETABLE_FRAME_KEY } from './useTimetableFrameList';

export default function useUpdateTimetableFrame() {
  const token = useTokenState();

  const queryClient = useQueryClient();
  const semester = useSemester();
  const mutate = useMutation(
    {
      mutationFn: (frameInfo: TimetableFrameInfo) => (
        updateTimetableFrame(
          token,
          frameInfo.id!,
          { name: frameInfo.timetable_name, is_main: frameInfo.is_main },
        )
      ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [TIMETABLE_FRAME_KEY + semester] });
      },
    },
  );

  return mutate;
}
