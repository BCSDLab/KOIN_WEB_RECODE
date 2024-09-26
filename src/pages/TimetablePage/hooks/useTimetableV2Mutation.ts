import { useMutation } from '@tanstack/react-query';
import useToast from 'components/common/Toast/useToast';
import { CustomTimetableLectureInfo, LectureInfo, TimetableLectureInfoV2 } from 'interfaces/Lecture';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useLecturesAction } from 'utils/zustand/myLectures';
import { useSemester } from 'utils/zustand/semester';
import useAddTimetableLectureV2 from './useAddTimetableLectureV2';
import useDeleteTimetableLectureV2 from './useDeleteTimetableLectureV2';

type RemoveMyLectureV2Props = {
  clickedLecture: LectureInfo | TimetableLectureInfoV2,
  id: number
};

export default function useTimetableV2Mutation(frameId: number) {
  const token = useTokenState();
  const toast = useToast();
  const { mutate: mutateAddWithServer } = useAddTimetableLectureV2(token);
  const {
    addLecture: addLectureFromLocalStorage,
    removeLecture: removeLectureFromLocalStorage,
  } = useLecturesAction();
  const { mutate: removeLectureFromServer } = useDeleteTimetableLectureV2(token);
  const semester = useSemester();

  const addMyLectureV2 = (clickedLecture: LectureInfo | CustomTimetableLectureInfo) => {
    if (token) {
      if ('class_title' in clickedLecture) {
        mutateAddWithServer({
          timetable_frame_id: frameId,
          timetable_lecture: [
            {
              ...clickedLecture,
              class_time: clickedLecture.class_time.flatMap((subArr) => [
                ...subArr,
                -1,
              ]),
              class_place: clickedLecture.class_place ? clickedLecture.class_place.join(', ') : '',
            },
          ],
        });
      } else {
        mutateAddWithServer({
          timetable_frame_id: frameId,
          timetable_lecture: [
            {
              ...clickedLecture,
              class_title: clickedLecture.name,
              lecture_id: clickedLecture.id,
            },
          ],
        });
      }
    } else if ('code' in clickedLecture) {
      addLectureFromLocalStorage(clickedLecture, semester);
    }
  };

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

  const removeMyLectureV2 = useMutation({
    mutationFn: async ({ clickedLecture, id } : RemoveMyLectureV2Props) => {
      sessionStorage.setItem('restoreLecture', JSON.stringify(clickedLecture));
      if ('name' in clickedLecture) {
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
  });

  return { addMyLectureV2, removeMyLectureV2 };
}
