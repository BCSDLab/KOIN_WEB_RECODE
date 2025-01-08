import DownloadIcon from 'assets/svg/download-icon.svg';
import EditIcon from 'assets/svg/pen-icon.svg';
import ErrorBoundary from 'components/common/ErrorBoundary';
import LoadingSpinner from 'components/common/LoadingSpinner';
import useDeptList from 'pages/Auth/SignupPage/hooks/useDeptList';
import Curriculum from 'pages/TimetablePage/components/Curriculum';
import Timetable from 'pages/TimetablePage/components/Timetable';
import TotalGrades from 'pages/TimetablePage/components/TotalGrades';
import useMyLectures from 'pages/TimetablePage/hooks/useMyLectures';
import useSemesterCheck from 'pages/TimetablePage/hooks/useMySemester';
import useTimetableDayList from 'pages/TimetablePage/hooks/useTimetableDayList';
import useTimetableFrameList from 'pages/TimetablePage/hooks/useTimetableFrameList';
import useLogger from 'utils/hooks/analytics/useLogger';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useSemester } from 'utils/zustand/semester';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DownloadTimetableModal from './DownloadTimetableModal';
import styles from './MyLectureTimetable.module.scss';

function MainTimetable({ frameId }: { frameId: number }) {
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const token = useTokenState();
  const semester = useSemester();
  const logger = useLogger();
  const navigate = useNavigate();
  const { data: timeTableFrameList } = useTimetableFrameList(token, semester);
  const { myLectures } = useMyLectures(frameId);
  const myLectureDayValue = useTimetableDayList(timeTableFrameList.length > 0 ? myLectures : []);
  const { data: deptList } = useDeptList();
  const { data: mySemester } = useSemesterCheck(token);

  const isSemesterAndTimetableExist = () => {
    if (mySemester?.semesters.length === 0) {
      toast.error('학기가 존재하지 않습니다. 학기를 추가해주세요.');
      return false;
    }

    if (timeTableFrameList.length === 0) {
      toast.error('시간표가 존재하지 않습니다. 시간표를 추가해주세요.');
      return false;
    }

    return true;
  };

  const onClickDownloadImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (isSemesterAndTimetableExist()) {
      logger.actionEventClick({
        actionTitle: 'USER',
        title: 'timetable',
        value: '이미지저장',
        duration_time:
          (new Date().getTime() - Number(sessionStorage.getItem('enterTimetablePage'))) / 1000,
      });
      openModal();
    }
  };

  const onClickEdit = () => {
    if (isSemesterAndTimetableExist()) {
      navigate(`/timetable/modify/regular/${token ? frameId : semester}`);
    }
  };

  return (
    <div className={styles['page__timetable-wrap']}>
      <div className={styles.page__filter}>
        <div className={styles['page__total-grades']}>
          <TotalGrades myLectureList={myLectures} />
        </div>
        <Curriculum list={deptList} />
        <button type="button" className={styles.page__button} onClick={onClickDownloadImage}>
          <DownloadIcon />
          이미지 저장
        </button>
        <button type="button" className={styles.page__button} onClick={onClickEdit}>
          <div className={styles['page__edit-icon']}>
            <EditIcon />
          </div>
          시간표 수정
        </button>
      </div>
      <div className={styles.page__timetable}>
        <ErrorBoundary fallbackClassName="loading">
          <React.Suspense fallback={<LoadingSpinner size="50" />}>
            <Timetable
              frameId={frameId}
              lectures={myLectureDayValue}
              columnWidth={140}
              firstColumnWidth={70}
              rowHeight={33}
              totalHeight={700}
            />
          </React.Suspense>
        </ErrorBoundary>
      </div>
      <div>{isModalOpen && <DownloadTimetableModal onClose={closeModal} frameId={frameId} />}</div>
    </div>
  );
}

export default MainTimetable;
