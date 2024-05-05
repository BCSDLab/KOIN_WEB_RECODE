import { LectureInfo, TimetableLectureInfo } from 'interfaces/Lecture';
import { useSetRecoilState } from 'recoil';
import useTokenState from 'utils/hooks/useTokenState';
import { myLectureRemoveLectureSelector } from 'utils/recoil/semester';
import { useLecturesAction } from 'utils/zustand/myLectures';
import { useSemester } from 'utils/zustand/semester';
import useAddTimetableLecture from './useAddTimetableLecture';
import useDeleteTimetableLecture from './useDeleteTimetableLecture';

export default function useTimetableMutation() {
  const token = useTokenState();
  const semester = useSemester();
  const { mutate: mutateAddWithServer } = useAddTimetableLecture(token);
  const { updateLectures } = useLecturesAction();
  const removeLectureFromLocalStorage = useSetRecoilState(myLectureRemoveLectureSelector);
  const { mutate: removeLectureFromServer } = useDeleteTimetableLecture(semester, token);

  const addMyLecture = (clickedLecture: LectureInfo) => {
    if (token && clickedLecture) {
      mutateAddWithServer({
        semester,
        timetable: [{ class_title: clickedLecture.name, ...clickedLecture }],
      });
    } else {
      updateLectures(clickedLecture, semester);
    }
  };

  const removeMyLecture = (clickedLecture: LectureInfo | TimetableLectureInfo) => {
    if ('name' in clickedLecture) {
      removeLectureFromLocalStorage(clickedLecture);
      return;
    }
    removeLectureFromServer(clickedLecture.id.toString());
  };

  return { addMyLecture, removeMyLecture };
}
