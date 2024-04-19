import React from 'react';
import Listbox, { ListboxProps } from 'components/TimetablePage/Listbox';
import {
  myLecturesAtom,
  selectedSemesterAtom,
  selectedTempLectureSelector,
} from 'utils/recoil/semester';
import { useRecoilValue } from 'recoil';
import Timetable from 'components/TimetablePage/Timetable';
import ErrorBoundary from 'components/common/ErrorBoundary';
import useTimetableDayList from 'utils/hooks/useTimetableDayList';
import useTokenState from 'utils/hooks/useTokenState';
import { ReactComponent as LoadingSpinner } from 'assets/svg/loading-spinner.svg';
import showToast from 'utils/ts/showToast';
import useSemester from 'components/TimetablePage/hooks/useSemester';
import { useSelectRecoil } from 'components/TimetablePage/hooks/useSelect';
import useLectureList from 'components/TimetablePage/hooks/useLectureList';
import useTimetableInfoList from 'components/TimetablePage/hooks/useTimetableInfoList';
import useImageDownload from 'utils/hooks/useImageDownload';
import useLogger from 'utils/hooks/useLogger';
import styles from './MobilePage.module.scss';

const useSemesterOptionList = () => {
  const { data: semesterList } = useSemester();

  const semesterOptionList = semesterList.map(
    (semesterInfo) => ({
      label: `${semesterInfo.semester.slice(0, 4)}년 ${semesterInfo.semester.slice(4)}학기`,
      value: semesterInfo.semester,
    }),
  );
  return semesterOptionList;
};

type DecidedListboxProps = Omit<ListboxProps, 'list'>;

function SemesterListbox({ value, onChange }: DecidedListboxProps) {
  const semesterOptionList = useSemesterOptionList();
  React.useEffect(() => {
    onChange({ target: { value: semesterOptionList[0].value } });
  // onChange와 deptOptionList가 렌더링될 때마다 선언되서 처음 한번만 해야 하는 onChange를 렌더링할 때마다 한다.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Listbox list={semesterOptionList} value={value} onChange={onChange} />
  );
}

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
  const { data: lectureList } = useLectureList(selectedSemester);
  const similarSelectedLecture = lectureList
    ?.filter((lecture) => lecture.code === selectedLecture?.code)
    ?? [];
  const similarSelectedLectureDayList = useTimetableDayList(similarSelectedLecture);
  const selectedLectureIndex = similarSelectedLecture
    .findIndex(({ lecture_class }) => lecture_class === selectedLecture?.lecture_class);
  return selectedSemesterValue ? (
    <Timetable
      lectures={myLectureDayValue}
      similarSelectedLecture={similarSelectedLectureDayList}
      selectedLectureIndex={selectedLectureIndex}
      columnWidth={55}
      firstColumnWidth={52}
      rowHeight={28}
      totalHeight={600}
    />
  ) : (
    <LoadingSpinner className={styles['top-loading-spinner']} />
  );
}

function MobilePage() {
  const {
    value: semesterFilterValue,
    onChangeSelect: onChangeSemesterSelect,
  } = useSelectRecoil(selectedSemesterAtom);
  const logger = useLogger();
  const { onImageDownload: onTimetableImageDownload, divRef: timetableRef } = useImageDownload();
  const handleImageDownloadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logger.click({
      title: 'timetable_imageDownload_click',
      value: '시간표 저장',
    });
    onTimetableImageDownload('my-timetable');
  };

  return (
    <>
      <div className={styles['page__timetable-wrap']}>
        <div className={styles.page__filter}>
          <div className={styles.page__semester}>
            <React.Suspense fallback={<LoadingSpinner className={styles['dropdown-loading-spinner']} />}>
              <SemesterListbox
                value={semesterFilterValue}
                onChange={onChangeSemesterSelect}
              />
            </React.Suspense>
          </div>
          <button
            type="button"
            className={styles.page__button}
            onClick={(e) => handleImageDownloadClick(e)}
          >
            <img src="https://static.koreatech.in/assets/img/ic-image.png" alt="이미지" />
            이미지로 저장하기
          </button>
        </div>
        <div ref={timetableRef} className={styles.page__timetable}>
          <ErrorBoundary fallbackClassName="loading">
            <React.Suspense fallback={<LoadingSpinner className={styles['top-loading-spinner']} />}>
              <CurrentSemesterTimetable />
            </React.Suspense>
          </ErrorBoundary>
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          showToast('info', 'PC환경만 지원합니다. PC를 이용해주세요.');
        }}
        className={styles['edit-timetable']}
      >
        시간표 편집하기
      </button>
    </>
  );
}

export { MobilePage };
