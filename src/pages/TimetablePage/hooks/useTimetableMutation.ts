import { LectureInfo, TimetableLectureInfo } from 'interfaces/Lecture';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useLecturesAction } from 'utils/zustand/myLectures';
import { useSemester } from 'utils/zustand/semester';
import useAddTimetableLecture from './useAddTimetableLecture';
import useDeleteTimetableLecture from './useDeleteTimetableLecture';

export default function useTimetableMutation() {
  const token = useTokenState();
  const semester = useSemester();
  const { mutate: mutateAddWithServer } = useAddTimetableLecture(token);
  const {
    addLecture: addLectureFromLocalStorage,
    removeLecture: removeLectureFromLocalStorage,
  } = useLecturesAction();
  const { mutate: removeLectureFromServer } = useDeleteTimetableLecture(semester, token);

  const addMyLecture = (clickedLecture: LectureInfo) => {
    if (token && clickedLecture) {
      mutateAddWithServer({
        semester,
        timetable: [{ class_title: clickedLecture.name, ...clickedLecture }],
      });
    } else {
      addLectureFromLocalStorage(clickedLecture, semester);
    }
  };

  const removeMyLecture = (clickedLecture: LectureInfo | TimetableLectureInfo) => {
    if ('name' in clickedLecture) {
      removeLectureFromLocalStorage(clickedLecture, semester);
    } else {
      removeLectureFromServer(clickedLecture.id);
    }
  };

  return { addMyLecture, removeMyLecture };
}
