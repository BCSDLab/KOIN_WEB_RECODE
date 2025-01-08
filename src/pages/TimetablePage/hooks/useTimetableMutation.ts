import { useMutation } from '@tanstack/react-query';
import useToast from 'components/common/Toast/useToast';
import { LectureInfo, TimetableLectureInfo } from 'api/timetable/entity';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useLecturesAction } from 'utils/zustand/myLectures';
import { useSemester } from 'utils/zustand/semester';
import showToast from 'utils/ts/showToast';
import { isKoinError, sendClientError } from '@bcsdlab/koin';
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
  const { mutate: mutateEditWithServer } = useEditTimetableLecture();
  const {
    addLecture: addLectureFromLocalStorage,
    removeLecture: removeLectureFromLocalStorage,
  } = useLecturesAction();
  const { mutate: removeLectureFromServer } = useDeleteTimetableLecture(token);
  const semester = useSemester();

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
      addLectureFromLocalStorage(clickedLecture, `${semester?.year}${semester?.term}`);
    }
  };

  // 강의 복원
  const restoreLecture = () => {
    const restoredLecture = JSON.parse(sessionStorage.getItem('restoreLecture')!);
    if ('name' in restoredLecture) {
      addLectureFromLocalStorage(restoredLecture, `${semester?.year}${semester?.term}`);
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
    mutateEditWithServer({ frameId, editedLecture, token });
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
