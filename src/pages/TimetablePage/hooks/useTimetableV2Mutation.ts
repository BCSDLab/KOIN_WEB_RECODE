import { CustomTimetableLectureInfo, LectureInfo, TimetableLectureInfoV2 } from 'interfaces/Lecture';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useLecturesAction } from 'utils/zustand/myLectures';
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

  const removeMyLectureV2 = (clickedLecture: LectureInfo | TimetableLectureInfoV2, id: number) => {
    if ('name' in clickedLecture) {
      removeLectureFromLocalStorage(clickedLecture, semester);
    } else if (id !== undefined) {
      removeLectureFromServer(id);
    }
  };

  return { addMyLectureV2, removeMyLectureV2 };
}
