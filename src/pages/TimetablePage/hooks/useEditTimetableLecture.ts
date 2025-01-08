import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { editTimetableLecture } from 'api/timetable';
import { TimetableLectureInfo } from 'api/timetable/entity';
import { TIMETABLE_INFO_LIST } from './useTimetableInfoList';

export default function useEditTimetableLecture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      frameId,
      editedLecture,
      token,
    }: {
      frameId: number;
      editedLecture: TimetableLectureInfo;
      token: string;
    }) =>
      editTimetableLecture(
        { timetable_frame_id: frameId, timetable_lecture: [editedLecture] },
        token
      ),
    onSuccess: (data, variables) => {
      queryClient.setQueryData([TIMETABLE_INFO_LIST, variables.frameId], data);
    },
    onError: (error) => {
      if (isKoinError(error)) {
        if (error.status === 401) toast('로그인을 해주세요');
        if (error.status === 403) toast('강의 수정에 실패했습니다.');
        if (error.status === 404) toast('강의 정보를 찾을 수 없습니다.');
      } else {
        sendClientError(error);
        toast('강의 수정에 실패했습니다.');
      }
    },
  });
}
