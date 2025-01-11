import { useMutation } from '@tanstack/react-query';
import useToast from 'components/common/Toast/useToast';
import {
  AddTimetableLecture,
  Lecture,
  MyLectureInfo,
  TimetableCustomLecture, TimetableRegularLecture,
} from 'api/timetable/entity';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useLecturesAction } from 'utils/zustand/myLectures';
import { useSemester } from 'utils/zustand/semester';
import showToast from 'utils/ts/showToast';
import { isKoinError, sendClientError } from '@bcsdlab/koin';
import useAddTimetableLectureRegular from './useAddTimetableLectureRegular';
import useAddTimetableLectureCustom from './useAddTimetableLectureCustom';
import useDeleteTimetableLecture from './useDeleteTimetableLecture';
import useEditTimetableLectureCustom from './useEditTimetableLectureCustom';
import useEditTimetableLectureRegular from './useEditTimetableLectureRegular';
import useRollbackLecture from './useRollbackLecture';

type RemoveMyLectureProps = {
  clickedLecture: Lecture | MyLectureInfo | null,
  id: number
};

export default function useTimetableMutation(frameId: number) {
  const token = useTokenState();
  const semester = useSemester();
  const toast = useToast();

  const { mutate: mutateAddWithServerCustom } = useAddTimetableLectureCustom(token);
  const { mutate: mutateAddWithServerRegular } = useAddTimetableLectureRegular(token);

  const { mutate: mutateEditWithServerCustom } = useEditTimetableLectureCustom();
  const { mutate: mutateEditWithServerRegular } = useEditTimetableLectureRegular();

  const { mutate: rollbackLecture } = useRollbackLecture(token, frameId);

  const {
    addLecture: addLectureFromLocalStorage,
    removeLecture: removeLectureFromLocalStorage,
  } = useLecturesAction();

  const { mutate: removeLectureFromServer } = useDeleteTimetableLecture(token);

  const addMyLecture = (clickedLecture : AddTimetableLecture | Lecture) => {
    if (token) {
      if ('lecture_id' in clickedLecture) {
        mutateAddWithServerRegular({
          timetable_frame_id: frameId,
          lecture_id: clickedLecture.lecture_id,
        });
      } else if ('timetable_lecture' in clickedLecture) {
        mutateAddWithServerCustom({
          timetable_frame_id: frameId,
          timetable_lecture:
            {
              class_title: clickedLecture.timetable_lecture.class_title,
              lecture_infos: clickedLecture.timetable_lecture.lecture_infos.map((info) => ({
                start_time: info.start_time,
                end_time: info.end_time,
                place: info.place,
              })),
              professor: clickedLecture.timetable_lecture.professor,
            },
        });
      }
    } else { // (비로그인)정규 강의 추가 시
      addLectureFromLocalStorage(clickedLecture as Lecture, `${semester?.year}${semester?.term}`);
    }
  };

  // 강의 복원
  const restoreLecture = (id: number[]) => {
    const restoredLecture = JSON.parse(sessionStorage.getItem('restoreLecture')!);
    if ('name' in restoredLecture) {
      addLectureFromLocalStorage(restoredLecture, `${semester?.year}${semester?.term}`);
    } else {
      rollbackLecture({
        timetable_lectures_id: id,
      });
    }
  };

  const editMyLecture = (editedLecture: TimetableRegularLecture | TimetableCustomLecture) => {
    if ('lecture_id' in editedLecture) {
      mutateEditWithServerRegular({
        frameId,
        editedLecture:
            {
              id: editedLecture.id,
              lecture_id: editedLecture.lecture_id,
              class_title: editedLecture.class_title,
              class_place: editedLecture.class_place,
            },
        token,
      });
    } else {
      mutateEditWithServerCustom({
        frameId,
        editedLecture:
            {
              id: editedLecture.id,
              class_title: editedLecture.class_title,
              lecture_infos: editedLecture.lecture_infos,
              professor: editedLecture.professor,
            },
        token,
      });
    }
  };

  const removeMyLecture = useMutation({
    mutationFn: async ({ clickedLecture, id } : RemoveMyLectureProps) => {
      sessionStorage.setItem('restoreLecture', JSON.stringify(clickedLecture));
      if (clickedLecture && 'name' in clickedLecture) {
        return Promise.resolve(removeLectureFromLocalStorage(clickedLecture, `${semester?.year}${semester?.term}`));
      }
      return removeLectureFromServer(id);
    },
    onSuccess: (_data, variables) => {
      const { id } = variables;
      toast.open({
        message: '해당 과목이 삭제되었습니다.',
        recoverMessage: '해당 과목이 복구되었습니다.',
        onRecover: () => restoreLecture([id]),
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
