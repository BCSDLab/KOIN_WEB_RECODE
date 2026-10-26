import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation } from '@tanstack/react-query';
import type {
  AddTimetableCustomLecture,
  Lecture,
  MyLectureInfo,
  Semester,
  TimetableCustomLecture,
  TimetableRegularLecture,
} from 'api/timetable/entity';
import useToast from 'components/feedback/Toast/useToast';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';
import { isomorphicSessionStorage } from 'utils/ts/env';
import showToast from 'utils/ts/showToast';
import { useLecturesAction } from 'utils/zustand/myLectures';
import { useSemester } from 'utils/zustand/semester';

import useAddTimetableLectureCustom from './useAddTimetableLectureCustom';
import useAddTimetableLectureRegular from './useAddTimetableLectureRegular';
import useDeleteTimetableLecture from './useDeleteTimetableLecture';
import useEditTimetableLectureCustom from './useEditTimetableLectureCustom';
import useEditTimetableLectureRegular from './useEditTimetableLectureRegular';
import useRollbackLecture from './useRollbackLecture';

interface RemoveMyLectureProps {
  clickedLecture: Lecture | MyLectureInfo | null;
  id: number;
}

export default function useTimetableMutation(timetableFrameId: number, semesterOverride?: Semester) {
  const isLoggedIn = useIsLoggedIn();
  const storedSemester = useSemester();
  const semester = semesterOverride ?? storedSemester;
  const toast = useToast();

  const { mutate: mutateAddWithServerCustom } = useAddTimetableLectureCustom(isLoggedIn);
  const { mutate: mutateAddWithServerRegular } = useAddTimetableLectureRegular(isLoggedIn);

  const { mutate: mutateEditWithServerCustom } = useEditTimetableLectureCustom();
  const { mutate: mutateEditWithServerRegular } = useEditTimetableLectureRegular();

  const { mutate: rollbackLecture } = useRollbackLecture(isLoggedIn, timetableFrameId);

  const { addLecture: addLectureFromLocalStorage, removeLecture: removeLectureFromLocalStorage } = useLecturesAction();

  const { mutate: removeLectureFromServer } = useDeleteTimetableLecture();

  const addMyLecture = (clickedLecture: AddTimetableCustomLecture | Lecture) => {
    if (isLoggedIn) {
      if ('name' in clickedLecture) {
        mutateAddWithServerRegular({
          timetable_frame_id: timetableFrameId,
          lecture_id: clickedLecture.id,
        });
      } else {
        mutateAddWithServerCustom({
          timetable_frame_id: timetableFrameId,
          timetable_lecture: {
            class_title: clickedLecture.class_title,
            lecture_infos: clickedLecture.lecture_infos,
            professor: clickedLecture.professor,
            grades: '0',
          },
        });
      }
    } else {
      // (비로그인)정규 강의 추가 시
      addLectureFromLocalStorage(clickedLecture as Lecture, `${semester?.year}${semester?.term}`);
    }
  };

  // 강의 복원
  const restoreLecture = (id: number[]) => {
    const restoredLecture = isomorphicSessionStorage.getJSONItem<Lecture | MyLectureInfo | null>(
      'restoreLecture',
      null,
    );
    if (!restoredLecture || typeof restoredLecture !== 'object') return;

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
        timetableFrameId,
        editedLecture: {
          id: editedLecture.id,
          lecture_id: editedLecture.lecture_id,
          class_title: editedLecture.class_title,
          class_places: editedLecture.class_places,
          course_type: editedLecture.course_type,
          general_education_area: editedLecture.general_education_area,
        },
        isLoggedIn,
      });
    } else {
      mutateEditWithServerCustom({
        timetableFrameId,
        editedLecture: {
          id: editedLecture.id,
          class_title: editedLecture.class_title,
          lecture_infos: editedLecture.lecture_infos,
          professor: editedLecture.professor,
        },
        isLoggedIn,
      });
    }
  };

  const removeMyLecture = useMutation({
    mutationFn: async ({ clickedLecture, id }: RemoveMyLectureProps & { disableRecoverButton?: boolean }) => {
      isomorphicSessionStorage.setJSONItem('restoreLecture', clickedLecture);
      if (clickedLecture && 'name' in clickedLecture) {
        return Promise.resolve(removeLectureFromLocalStorage(clickedLecture, `${semester?.year}${semester?.term}`));
      }

      return removeLectureFromServer(id);
    },
    onSuccess: (_data, variables) => {
      const { id, disableRecoverButton } = variables;
      toast.open({
        message: '해당 과목이 삭제되었습니다.',
        recoverMessage: disableRecoverButton ? undefined : '해당 과목이 복구되었습니다.',
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
