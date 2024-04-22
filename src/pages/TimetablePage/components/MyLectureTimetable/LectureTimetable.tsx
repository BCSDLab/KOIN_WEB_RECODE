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
  // TODO: selectedSemesterValue가 바뀔 때 myLecturesFromServer가 학기별 강의를 불러오지 못함
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
