import React from 'react';
import ErrorBoundary from 'components/common/ErrorBoundary';
import { useRecoilValue } from 'recoil';
import useTokenState from 'utils/hooks/useTokenState';
import { myLecturesAtom, selectedSemesterAtom } from 'utils/recoil/semester';
import useTimetableInfoList from 'components/TimetablePage/DefaultPage/hooks/useTimetableInfoList';
import useTimetableDayList from 'utils/hooks/useTimetableDayList';
import Timetable from 'components/TimetablePage/Timetable';
import { useSelectRecoil } from 'components/TimetablePage/DefaultPage/hooks/useSelect';
import { useSemesterOptionList } from 'components/TimetablePage/DefaultPage';
import { Link } from 'react-router-dom';
import { ReactComponent as LoadingSpinner } from 'assets/svg/loading-spinner.svg';
import styles from './IndexTimetable.module.scss';

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

  return selectedSemesterValue ? (
    <Timetable
      lectures={myLectureDayValue}
      colWidth={40}
      firstColWidth={42}
      rowHeight={16}
      totalHeight={369}
    />
  ) : (
    <LoadingSpinner className={styles['template__loading-spinner']} />
  );
}

export default function IndexTimeTable() {
  const {
    onChangeSelect: onChangeSemesterSelect,
  } = useSelectRecoil(selectedSemesterAtom);
  const semesterOptionList = useSemesterOptionList();
  React.useEffect(() => {
    onChangeSemesterSelect({ target: { value: semesterOptionList[0].value } });
  // onChange와 deptOptionList가 렌더링될 때마다 선언되서 처음 한번만 해야 하는 onChange를 렌더링할 때마다 한다.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const token = useTokenState();

  return (
    <div className={styles.template}>
      <Link to="/timetable" className={styles.title}>
        시간표
      </Link>
      <ErrorBoundary fallbackClassName="loading">
        <React.Suspense fallback={<LoadingSpinner className={styles['template__loading-spinner']} />}>
          <Link to="/timetable">
            <CurrentSemesterTimetable />
          </Link>
        </React.Suspense>
      </ErrorBoundary>
      {!token && (
        <Link to="/auth" className={styles.needLogin} />
      )}
    </div>
  );
}
