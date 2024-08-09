import ErrorBoundary from 'components/common/ErrorBoundary';
import LoadingSpinner from 'components/common/LoadingSpinner';
import React from 'react';
import useTimetableDayListV2 from 'utils/hooks/useTimetableDayListV2';
import { useNavigate } from 'react-router-dom';
import useDeptList from 'pages/Auth/SignupPage/hooks/useDeptList';
import CurriculumListBox from 'pages/Timetable/components/Curriculum';
import { ReactComponent as DownloadIcon } from 'assets/svg/download-icon.svg';
import { ReactComponent as EditIcon } from 'assets/svg/pen-icon.svg';
import Timetable from 'components/TimetablePage/Timetable';
import useBooleanState from 'utils/hooks/useBooleanState';
import useTimetableV2InfoList from 'pages/Timetable/hooks/useTimetableV2InfoList';
import TotalGrades from 'pages/Timetable/components/TotalGrades';
import styles from './MyLectureTimetable.module.scss';
import DownloadTimetableModal from './DownloadTimetableModal';

export default function MainTimetable({ frameId }: { frameId: number }) {
  const { data: myLectureList } = useTimetableV2InfoList(frameId);
  const [myLectureListDetail, setMyLectureListDetail] = React.useState<any>();
  const navigate = useNavigate();
  const myLectureDayValue = useTimetableDayListV2(myLectureListDetail);
  const { data: deptList } = useDeptList();
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const onClickDownloadImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    openModal();
  };

  React.useEffect(() => {
    if (myLectureList && myLectureList.timetable) {
      setMyLectureListDetail(myLectureList.timetable);
    }
  }, [myLectureList]);

  return (
    <div className={styles['page__timetable-wrap']}>
      <div className={styles.page__filter}>
        <div className={styles['page__total-grades']}>
          <TotalGrades grades={myLectureList?.grades} />
        </div>
        <CurriculumListBox list={deptList} />
        <button
          type="button"
          className={styles.page__button}
          onClick={onClickDownloadImage}
        >
          <DownloadIcon />
          이미지 저장
        </button>
        <button
          type="button"
          className={styles.page__button}
          onClick={() => navigate(`/timetable/modify/regular/${frameId}`)}
        >
          <EditIcon />
          시간표 수정
        </button>
      </div>
      <div className={styles.page__timetable}>
        <ErrorBoundary fallbackClassName="loading">
          <React.Suspense fallback={<LoadingSpinner size="50" />}>
            <Timetable
              lectures={myLectureDayValue}
              columnWidth={140}
              firstColumnWidth={70}
              rowHeight={33}
              totalHeight={700}
            />
          </React.Suspense>
        </ErrorBoundary>
      </div>
      <div>
        {isModalOpen && <DownloadTimetableModal onClose={closeModal} />}
      </div>
    </div>
  );
}
