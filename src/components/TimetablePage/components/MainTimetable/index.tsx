import ErrorBoundary from 'components/boundary/ErrorBoundary';
import LoadingSpinner from 'components/feedback/LoadingSpinner';
import React from 'react';
import useDeptList from 'components/Auth/SignupPage/hooks/useDeptList';
import Curriculum from 'components/TimetablePage/components/Curriculum';
import DownloadIcon from 'assets/svg/download-icon.svg';
import EditIcon from 'assets/svg/pen-icon.svg';
import GraduationIcon from 'assets/svg/graduation-icon.svg';
import Timetable from 'components/TimetablePage/components/Timetable';
import TotalGrades from 'components/TimetablePage/components/TotalGrades';
import useMyLectures from 'components/TimetablePage/hooks/useMyLectures';
import { useSemester } from 'utils/zustand/semester';
import useTokenState from 'utils/hooks/state/useTokenState';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useLogger from 'utils/hooks/analytics/useLogger';
import useSemesterCheck from 'components/TimetablePage/hooks/useMySemester';
import { toast } from 'react-toastify';
import useTimetableFrameList from 'components/TimetablePage/hooks/useTimetableFrameList';
import ROUTES from 'static/routes';
import { useRouter } from 'next/router';
import styles from './MyLectureTimetable.module.scss';
import DownloadTimetableModal from './DownloadTimetableModal';

function MainTimetable({ timetableFrameId }: { timetableFrameId: number }) {
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const token = useTokenState();
  const semester = useSemester();
  const logger = useLogger();
  const router = useRouter();
  const { data: timeTableFrameList } = useTimetableFrameList(token, semester);
  const { myLectures } = useMyLectures(timetableFrameId);
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
        team: 'USER',
        event_label: 'timetable',
        value: '이미지저장',
        duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enterTimetablePage'))) / 1000,
      });
      openModal();
    }
  };

  const onClickEdit = () => {
    if (isSemesterAndTimetableExist()) {
      router.push(
        `/${ROUTES.TimetableRegular({ id: String(timetableFrameId), isLink: true })}?year=${semester?.year}&term=${semester?.term}`,
      );
    }
  };

  return (
    <div className={styles['page__timetable-wrap']}>
      <div className={styles.page__filter}>
        <div className={styles['page__total-grades']}>
          <TotalGrades myLectureList={myLectures} />
        </div>
        <button
          type="button"
          className={styles.page__button}
          onClick={() => {
            router.push('/graduation');
            logger.actionEventClick({
              team: 'USER',
              event_label: 'graduation_calculator',
              value: '졸업학점 계산기',
            });
          }}
        >
          <GraduationIcon />
          졸업학점 계산기
        </button>
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
              timetableFrameId={timetableFrameId}
              columnWidth={140}
              firstColumnWidth={70}
              rowHeight={33}
              totalHeight={700}
            />
          </React.Suspense>
        </ErrorBoundary>
      </div>
      <div>{isModalOpen && <DownloadTimetableModal onClose={closeModal} timetableFrameId={timetableFrameId} />}</div>
    </div>
  );
}

export default MainTimetable;
