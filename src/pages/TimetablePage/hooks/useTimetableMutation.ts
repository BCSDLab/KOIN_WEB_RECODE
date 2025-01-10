import { useMutation } from '@tanstack/react-query';
import useToast from 'components/common/Toast/useToast';
import {
  AddTimetableLecture,
  LectureInfo, TimetableCustomLecture, TimetableRegularLecture,
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

type RemoveMyLectureProps = {
  clickedLecture: LectureInfo | Omit<TimetableLectureInfo, 'id'> | null,
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

  const {
    addLecture: addLectureFromLocalStorage,
    removeLecture: removeLectureFromLocalStorage,
  } = useLecturesAction();

  const { mutate: removeLectureFromServer } = useDeleteTimetableLecture(token);

  const addMyLecture = (clickedLecture : AddTimetableLecture) => {
    if (token) {
      if ('lecture_id' in clickedLecture) {
        mutateAddWithServerRegular({
          timetable_frame_id: 13256, // frameId 라고 바꾸기 frame 수정하면 v3
          lecture_id: clickedLecture.lecture_id,
        });
      } else {
        mutateAddWithServerCustom({
          timetable_frame_id: 13256, // frameId 라고 바꾸기 frame 수정하면 v3
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
    // } else if ('code' in clickedLecture) { // (비로그인)정규 강의 추가 시
    //   addLectureFromLocalStorage(clickedLecture, semester);
    // }
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
