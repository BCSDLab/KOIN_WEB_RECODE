import ErrorBoundary from 'components/common/ErrorBoundary';
import LoadingSpinner from 'components/common/LoadingSpinner';
import React from 'react';
import useTimetableDayListV2 from 'pages/TimetablePage/hooks/useTimetableDayListV2';
import { useNavigate } from 'react-router-dom';
import useDeptList from 'pages/Auth/SignupPage/hooks/useDeptList';
import Curriculum from 'pages/TimetablePage/components/Curriculum';
import DownloadIcon from 'assets/svg/download-icon.svg';
import EditIcon from 'assets/svg/pen-icon.svg';
import Timetable from 'pages/TimetablePage/components/Timetable';
import TotalGrades from 'pages/TimetablePage/components/TotalGrades';
import useMyLecturesV2 from 'pages/TimetablePage/hooks/useMyLecturesV2';
import { useSemester } from 'utils/zustand/semester';
import useTokenState from 'utils/hooks/state/useTokenState';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useLogger from 'utils/hooks/analytics/useLogger';
import useSemesterCheck from 'pages/TimetablePage/hooks/useMySemester';
import { toast } from 'react-toastify';
import useTimetableFrameList from 'pages/TimetablePage/hooks/useTimetableFrameList';
import styles from './MyLectureTimetable.module.scss';
import DownloadTimetableModal from './DownloadTimetableModal';

function MainTimetable({ frameId }: { frameId: number }) {
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const token = useTokenState();
  const semester = useSemester();
  const logger = useLogger();
  const navigate = useNavigate();
  const { data: timeTableFrameList } = useTimetableFrameList(token, semester);
  const { myLecturesV2 } = useMyLecturesV2(frameId);
  const myLectureDayValue = useTimetableDayListV2(
    timeTableFrameList.length > 0 ? myLecturesV2 : [],
  );
  const { data: deptList } = useDeptList();
  const { data: mySemester } = useSemesterCheck(token);

  const onClickDownloadImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    logger.actionEventClick({
      actionTitle: 'USER',
      title: 'timetable',
      value: '이미지저장',
      duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enterTimetablePage'))) / 1000,
    });
    openModal();
  };

  const onClickEdit = () => {
    if (mySemester?.semesters.length === 0) {
      toast('학기가 존재하지 않습니다. 학기를 추가해주세요.');
    } else if (timeTableFrameList.length === 0) {
      toast('시간표가 존재하지 않습니다. 시간표를 추가해주세요.');
    } else {
      navigate(`/timetable/modify/regular/${token ? frameId : semester}`);
    }
  };

  return (
    <div className={styles['page__timetable-wrap']}>
      <div className={styles.page__filter}>
        <div className={styles['page__total-grades']}>
          <TotalGrades myLectureList={myLecturesV2} />
        </div>
        <Curriculum list={deptList} />
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
          onClick={onClickEdit}
        >
          <EditIcon className={styles['page__edit-icon']} />
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
      <div>
        {isModalOpen && (
          <DownloadTimetableModal onClose={closeModal} frameId={frameId} />
        )}
      </div>
    </div>
  );
}

export default MainTimetable;
