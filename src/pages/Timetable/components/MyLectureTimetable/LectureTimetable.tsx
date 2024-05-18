/* eslint-disable react/require-default-props */
import Timetable from 'components/TimetablePage/Timetable';
import { TimetableDayLectureInfo } from 'interfaces/Lecture';

interface Props {
  lectures: TimetableDayLectureInfo[][];
  selectedLectureIndex?: number;
  similarSelectedLecture?: TimetableDayLectureInfo[][];
}

function LectureTimetable(
  { lectures, similarSelectedLecture, selectedLectureIndex } : Props,
) {
  return (
    <Timetable
      lectures={lectures}
      similarSelectedLecture={similarSelectedLecture}
      selectedLectureIndex={selectedLectureIndex}
      columnWidth={55}
      firstColumnWidth={52}
      rowHeight={21}
      totalHeight={456}
    />
  );
}

export default LectureTimetable;
