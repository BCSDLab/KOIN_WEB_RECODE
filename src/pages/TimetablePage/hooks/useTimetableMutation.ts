import { LectureInfo, TimetableLectureInfo } from 'interfaces/Lecture';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import useTokenState from 'utils/hooks/useTokenState';
import { myLectureAddLectureSelector, myLectureRemoveLectureSelector, selectedSemesterAtom } from 'utils/recoil/semester';
import useAddTimetableLecture from './useAddTimetableLecture';
import useDeleteTimetableLecture from './useDeleteTimetableLecture';

export default function useTimetableMutation() {
  const token = useTokenState();
  const selectedSemester = useRecoilValue(selectedSemesterAtom);
  const { mutate: mutateAddWithServer } = useAddTimetableLecture(token);
  const addLectureToLocalStorage = useSetRecoilState(myLectureAddLectureSelector);
  const removeLectureFromLocalStorage = useSetRecoilState(myLectureRemoveLectureSelector);
  const { mutate: removeLectureFromServer } = useDeleteTimetableLecture(selectedSemester, token);

  const addMyLecture = (clickedLecture: LectureInfo) => {
    if (token) {
      mutateAddWithServer({
        semester: selectedSemester,
        timetable: [{ class_title: clickedLecture.name, ...clickedLecture }],
      });
    } else {
      addLectureToLocalStorage(clickedLecture);
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
