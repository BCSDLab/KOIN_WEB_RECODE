import { useMutation, useQueryClient } from '@tanstack/react-query';
import useToast from 'components/common/Toast/useToast';
import { LectureInfo, TimetableLectureInfo } from 'api/timetable/entity';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useLecturesAction } from 'utils/zustand/myLectures';
import { useSemester } from 'utils/zustand/semester';
import showToast from 'utils/ts/showToast';
import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { TIMETABLE_INFO_LIST } from './useTimetableInfoList';
import useAddTimetableLecture from './useAddTimetableLecture';
import useDeleteTimetableLecture from './useDeleteTimetableLecture';
import useEditTimetableLecture from './useEditTimetableLecture';

type RemoveMyLectureProps = {
  clickedLecture: LectureInfo | Omit<TimetableLectureInfo, 'id'> | null,
  id: number
};

export default function useTimetableMutation(frameId: number) {
  const token = useTokenState();
  const toast = useToast();
  const { mutate: mutateAddWithServer } = useAddTimetableLecture(token);
  const { mutate: mutateEditWithServer } = useEditTimetableLecture(token);
  const {
    addLecture: addLectureFromLocalStorage,
    removeLecture: removeLectureFromLocalStorage,
  } = useLecturesAction();
  const { mutate: removeLectureFromServer } = useDeleteTimetableLecture(token);
  const semester = useSemester();
  const queryClient = useQueryClient();

  const addMyLecture = (clickedLecture: LectureInfo | Omit<TimetableLectureInfo, 'id'>) => {
    if (token) {
      // 커스텀 강의 추가 시
      if ('class_title' in clickedLecture) {
        mutateAddWithServer({
          timetable_frame_id: frameId,
          timetable_lecture: [
            {
              class_title: clickedLecture.class_title,
              class_infos: clickedLecture.class_infos,
              professor: clickedLecture.professor,
            },
          ],
        });
      } else { // 정규 강의 추가 시
        mutateAddWithServer({
          timetable_frame_id: frameId,
          timetable_lecture: [
            {
              ...clickedLecture, // 필요 없을 수도 있음
              class_title: null,
              class_infos: null,
              professor: null,
              grades: '0',
              lecture_id: clickedLecture.id,
            },
          ],
        });
      }
    } else if ('code' in clickedLecture) { // (비로그인)정규 강의 추가 시
      addLectureFromLocalStorage(clickedLecture, semester);
    }
  };

  // 강의 복원
  const restoreLecture = () => {
    const restoredLecture = JSON.parse(sessionStorage.getItem('restoreLecture')!);
    if ('name' in restoredLecture) {
      addLectureFromLocalStorage(restoredLecture, semester);
    } else {
      mutateAddWithServer({
        timetable_frame_id: frameId,
        timetable_lecture: [
          restoredLecture,
        ],
      });
    }
  };

  const editMyLecture = (editedLecture: TimetableLectureInfo) => {
    mutateEditWithServer(
      {
        timetable_frame_id: frameId,
        timetable_lecture: [editedLecture], // API 요청 형식에 맞게 데이터 전달
      },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(
            [TIMETABLE_INFO_LIST, frameId],
            data,
          );
          showToast('success', '강의가 성공적으로 수정되었습니다.');
        },
        onError: (error) => {
          if (isKoinError(error)) {
            if (error.status === 401) showToast('error', '로그인을 해주세요');
            if (error.status === 403) showToast('error', '강의 수정에 실패했습니다.');
            if (error.status === 404) showToast('error', '강의 정보를 찾을 수 없습니다.');
          } else {
            sendClientError(error);
            showToast('error', '강의 수정에 실패했습니다.');
          }
        },
      },
    );
  };

  const removeMyLecture = useMutation({
    mutationFn: async ({ clickedLecture, id } : RemoveMyLectureProps) => {
      sessionStorage.setItem('restoreLecture', JSON.stringify(clickedLecture));
      if (clickedLecture && 'name' in clickedLecture) {
        return Promise.resolve(removeLectureFromLocalStorage(clickedLecture, semester));
      }
      return removeLectureFromServer(id);
    },
    onSuccess: () => {
      toast.open({
        message: '해당 과목이 삭제되었습니다.',
        recoverMessage: '해당 과목이 복구되었습니다.',
        onRecover: restoreLecture,
      });
    },
    onError: (error) => {
      if (isKoinError(error)) {
        // 추후에 코드별 에러 분기처리 진행
        showToast('error', error.message || '강의 삭제에 실패했습니다.');
      } else {
        sendClientError(error);
        showToast('error', '강의 삭제에 실패했습니다.');
      }
    },
  });

  return { addMyLecture, editMyLecture, removeMyLecture };
}
