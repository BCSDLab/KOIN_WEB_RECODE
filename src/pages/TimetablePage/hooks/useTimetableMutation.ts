import { LectureInfo, TimetableLectureInfo } from 'interfaces/Lecture';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import useTokenState from 'utils/hooks/useTokenState';
import { myLectureRemoveLectureSelector, selectedSemesterAtom } from 'utils/recoil/semester';
import { useLecturesAction } from 'utils/zustand/myLectures';
import { useSemester } from 'utils/zustand/semester';
import useAddTimetableLecture from './useAddTimetableLecture';
import useDeleteTimetableLecture from './useDeleteTimetableLecture';

export default function useTimetableMutation() {
  const token = useTokenState();
  const semester = useSemester();
  const selectedSemester = useRecoilValue(selectedSemesterAtom);
  const { mutate: mutateAddWithServer } = useAddTimetableLecture(token);
  const { updateLectures } = useLecturesAction();
  const removeLectureFromLocalStorage = useSetRecoilState(myLectureRemoveLectureSelector);
  const { mutate: removeLectureFromServer } = useDeleteTimetableLecture(selectedSemester, token);

  const addMyLecture = (clickedLecture: LectureInfo | null) => {
    if (token && clickedLecture) {
      mutateAddWithServer({
        semester: selectedSemester,
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
