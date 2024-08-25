import { LectureInfo, TimetableLectureInfoV2 } from 'interfaces/Lecture';
import useTokenState from 'utils/hooks/useTokenState';
import { useLecturesAction } from 'utils/zustand/myLecturesV2';
import { useSemester } from 'utils/zustand/semester';
import useAddTimetableLectureV2 from './useAddTimetableLectureV2';
import useDeleteTimetableLectureV2 from './useDeleteTimetableLectureV2';

export default function useTimetableV2Mutation(frameId: number) {
  const token = useTokenState();
  const { mutate: mutateAddWithServer } = useAddTimetableLectureV2(token);
  const {
    addLecture: addLectureFromLocalStorage,
    removeLecture: removeLectureFromLocalStorage,
  } = useLecturesAction();
  const { mutate: removeLectureFromServer } = useDeleteTimetableLectureV2(token);
  const semester = useSemester();

  const addMyLectureV2 = (clickedLecture: LectureInfo) => {
    if (token && clickedLecture) {
      mutateAddWithServer({
        timetable_frame_id: frameId,
        timetable_lecture: [
          {
            class_title: clickedLecture.name,
            lecture_id: clickedLecture.id,
            ...clickedLecture,
          },
        ],
      });
    } else {
      addLectureFromLocalStorage(clickedLecture, semester);
    }
  };

  const removeMyLectureV2 = (clickedLecture: LectureInfo | TimetableLectureInfoV2, id: number) => {
    if ('name' in clickedLecture) {
      removeLectureFromLocalStorage(clickedLecture, semester);
    } else if (id !== undefined) {
      removeLectureFromServer(id);
    } else {
      console.error('removeMyLectureV2: id is undefined');
    }
  };

  return { addMyLectureV2, removeMyLectureV2 };
}
