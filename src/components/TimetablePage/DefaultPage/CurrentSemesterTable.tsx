/* eslint-disable no-restricted-imports */
import LoadingSpinner from 'components/common/LoadingSpinner';
import { LectureInfo } from 'interfaces/Lecture';
import { useRecoilValue } from 'recoil';
import useTimetableDayList from 'utils/hooks/useTimetableDayList';
import useTokenState from 'utils/hooks/useTokenState';
import { myLecturesAtom, selectedSemesterAtom, selectedTempLectureSelector } from 'utils/recoil/semester';
import useLectureList from '../hooks/useLectureList';
import useTimetableInfoList from '../hooks/useTimetableInfoList';
import Timetable from '../Timetable';

function CurrentSemesterTimetable(): JSX.Element {
  const selectedSemesterValue = useRecoilValue(selectedSemesterAtom);
  const myLecturesFromLocalStorageValue = useRecoilValue(myLecturesAtom);

  const token = useTokenState();
  const selectedSemester = useRecoilValue(selectedSemesterAtom);
  const { data: myLecturesFromServer } = useTimetableInfoList(selectedSemester, token);
  const myLectureDayValue = useTimetableDayList(
    token
      ? (myLecturesFromServer ?? [])
      : (myLecturesFromLocalStorageValue ?? []),
  );

  const selectedLecture = useRecoilValue(selectedTempLectureSelector);
  const { data: lectureList, status } = useLectureList(selectedSemester);
  const similarSelectedLecture = (lectureList as unknown as Array<LectureInfo>)
    ?.filter((lecture) => lecture.code === selectedLecture?.code)
    ?? [];
  const similarSelectedLectureDayList = useTimetableDayList(similarSelectedLecture);
  const selectedLectureIndex = similarSelectedLecture
    .findIndex(({ lecture_class }) => lecture_class === selectedLecture?.lecture_class);
  // TODO: selectedSemesterValue가 바뀔 때 myLecturesFromServer가 학기별 강의를 불러오지 못함
  return selectedSemesterValue && status === 'success' ? (
    <Timetable
      lectures={myLectureDayValue}
      similarSelectedLecture={similarSelectedLectureDayList}
      selectedLectureIndex={selectedLectureIndex}
      columnWidth={55}
      firstColumnWidth={52}
      rowHeight={21}
      totalHeight={456}
    />
  ) : (
    <LoadingSpinner size="50" />
  );
}

export default CurrentSemesterTimetable;
