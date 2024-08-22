import React, { Suspense, useEffect } from 'react';
import Timetable from 'components/TimetablePage/Timetable';
import { Link } from 'react-router-dom';
import { ReactComponent as LoadingSpinner } from 'assets/svg/loading-spinner.svg';
import useLogger from 'utils/hooks/useLogger';
import ErrorBoundary from 'components/common/ErrorBoundary';
import { useSemesterAction, useSemester } from 'utils/zustand/semester';
import useSemesterOptionList from 'pages/Timetable/hooks/useSemesterOptionList';
import useMyLecturesV2 from 'pages/Timetable/hooks/useMyLecturesV2';
import useTimetableFrameList from 'pages/Timetable/hooks/useTimetableFrameList';
import useTokenState from 'utils/hooks/useTokenState';
import useTimetableDayListV2 from 'utils/hooks/useTimetableDayListV2';
import styles from './IndexTimetable.module.scss';

function CurrentSemesterTimetable() {
  const semester = useSemester();
  const token = useTokenState();
  const { data: timetableFrameList } = useTimetableFrameList(token, semester);
  const [currentFrameIndex, setCurrentFrameIndex] = React.useState<number>(0);

  useEffect(() => {
    if (timetableFrameList) {
      const mainFrame = timetableFrameList.find((frame) => frame.is_main === true);
      if (mainFrame && mainFrame.id) {
        setCurrentFrameIndex(mainFrame.id);
      }
    }
  }, [timetableFrameList]);

  const { myLecturesV2 } = useMyLecturesV2(currentFrameIndex);
  const myLectureDayValueV2 = useTimetableDayListV2(myLecturesV2);

  return myLectureDayValueV2 ? (
    <Timetable
      frameId={currentFrameIndex}
      lectures={myLectureDayValueV2}
      columnWidth={44}
      firstColumnWidth={29}
      rowHeight={17.3}
      totalHeight={369}
    />
  ) : (
    <LoadingSpinner className={styles['template__loading-spinner']} />
  );
}

export default function IndexTimeTable() {
  const { updateSemester } = useSemesterAction();
  const semesterOptionList = useSemesterOptionList();
  const logger = useLogger();

  useEffect(() => {
    if (semesterOptionList.length > 0) updateSemester(semesterOptionList[0].value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.template}>
      <Link
        to="/timetable"
        className={styles.title}
        onClick={() => {
          logger.actionEventClick({
            actionTitle: 'USER',
            title: 'entry_text_timetable',
            value: '시간표 텍스트 진입',
          });
        }}
      >
        시간표
      </Link>
      <ErrorBoundary fallbackClassName="loading">
        <Suspense fallback={null}>
          <Link
            to="/timetable"
            onClick={() => {
              logger.actionEventClick({
                actionTitle: 'USER',
                title: 'entry_table_timetable',
                value: '시간표 테이블 진입',
              });
            }}
          >
            <CurrentSemesterTimetable />
          </Link>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
