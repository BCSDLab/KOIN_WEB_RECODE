import React from 'react';
import { useRouter } from 'next/router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { deptQueries } from 'api/dept/queries';
import { Lecture, MyLectureInfo } from 'api/timetable/entity';
import { isValidTimetableFrameId } from 'api/timetable/queries';
import DownloadIcon from 'assets/svg/download-icon.svg';
import GraduationIcon from 'assets/svg/graduation-icon.svg';
import EditIcon from 'assets/svg/pen-icon.svg';
import Curriculum from 'components/TimetablePage/components/Curriculum';
import Timetable from 'components/TimetablePage/components/Timetable';
import TimetableGridPlaceholder from 'components/TimetablePage/components/TimetableGridPlaceholder';
import TotalGrades from 'components/TimetablePage/components/TotalGrades';
import useMyLectures from 'components/TimetablePage/hooks/useMyLectures';
import useSemesterCheck from 'components/TimetablePage/hooks/useMySemester';
import useTimetableFrameList from 'components/TimetablePage/hooks/useTimetableFrameList';
import { toast } from 'react-toastify';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useSemester } from 'utils/zustand/semester';
import DownloadTimetableModal from './DownloadTimetableModal';
import styles from './MyLectureTimetable.module.scss';

interface MainTimetableLayoutProps {
  curriculum: React.ReactNode;
  myLectures: Lecture[] | MyLectureInfo[] | undefined;
  onClickDownloadImage: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClickEdit: () => void;
  onClickGraduation: () => void;
  timetableContent: React.ReactNode;
  footer?: React.ReactNode;
}

function MainTimetableLayout({
  curriculum,
  myLectures,
  onClickDownloadImage,
  onClickEdit,
  onClickGraduation,
  timetableContent,
  footer,
}: MainTimetableLayoutProps) {
  return (
    <div className={styles['page__timetable-wrap']}>
      <div className={styles.page__filter}>
        <div className={styles['page__total-grades']}>
          <TotalGrades myLectureList={myLectures} />
        </div>
        <button type="button" className={styles.page__button} onClick={onClickGraduation}>
          <GraduationIcon />
          졸업학점 계산기
        </button>
        {curriculum}
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
      <div className={styles.page__timetable}>{timetableContent}</div>
      <div>{footer}</div>
    </div>
  );
}

function InvalidMainTimetable() {
  const token = useTokenState();
  const semester = useSemester();
  const logger = useLogger();
  const router = useRouter();
  const { data: timeTableFrameList } = useTimetableFrameList(token, semester);
  const { data: deptList } = useSuspenseQuery(deptQueries.list());
  const { data: mySemester } = useSemesterCheck(token);

  const isSemesterAndTimetableExist = () => {
    if (mySemester?.semesters.length === 0) {
      toast.error('학기가 존재하지 않습니다. 학기를 추가해주세요.');
      return false;
    }

    if (!timeTableFrameList.some((frame) => isValidTimetableFrameId(frame.id))) {
      toast.error('시간표가 존재하지 않습니다. 시간표를 추가해주세요.');
      return false;
    }

    return true;
  };

  const onClickDownloadImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    isSemesterAndTimetableExist();
  };

  const onClickEdit = () => {
    isSemesterAndTimetableExist();
  };

  return (
    <MainTimetableLayout
      curriculum={<Curriculum list={deptList} />}
      myLectures={[]}
      onClickDownloadImage={onClickDownloadImage}
      onClickEdit={onClickEdit}
      onClickGraduation={() => {
        router.push(ROUTES.GraduationCalculator());
        logger.actionEventClick({
          team: 'USER',
          event_label: 'graduation_calculator',
          value: '졸업학점 계산기',
        });
      }}
      timetableContent={<TimetableGridPlaceholder columnWidth={140} firstColumnWidth={70} rowHeight={33} totalHeight={700} />}
    />
  );
}

function ValidMainTimetable({ timetableFrameId }: { timetableFrameId: number }) {
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const token = useTokenState();
  const semester = useSemester();
  const logger = useLogger();
  const router = useRouter();
  const { data: timeTableFrameList } = useTimetableFrameList(token, semester);
  const { myLectures } = useMyLectures(timetableFrameId);
  const { data: deptList } = useSuspenseQuery(deptQueries.list());
  const { data: mySemester } = useSemesterCheck(token);

  const isSemesterAndTimetableExist = () => {
    if (mySemester?.semesters.length === 0) {
      toast.error('학기가 존재하지 않습니다. 학기를 추가해주세요.');
      return false;
    }

    if (!timeTableFrameList.some((frame) => isValidTimetableFrameId(frame.id))) {
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
        `/${ROUTES.TimetableModify({ id: String(timetableFrameId), type: 'regular' })}&year=${semester?.year}&term=${semester?.term}`,
      );
    }
  };

  return (
    <MainTimetableLayout
      curriculum={<Curriculum list={deptList} />}
      myLectures={myLectures}
      onClickDownloadImage={onClickDownloadImage}
      onClickEdit={onClickEdit}
      onClickGraduation={() => {
        router.push(ROUTES.GraduationCalculator());
        logger.actionEventClick({
          team: 'USER',
          event_label: 'graduation_calculator',
          value: '졸업학점 계산기',
        });
      }}
      timetableContent={
        <Timetable timetableFrameId={timetableFrameId} columnWidth={140} firstColumnWidth={70} rowHeight={33} totalHeight={700} />
      }
      footer={isModalOpen && <DownloadTimetableModal onClose={closeModal} timetableFrameId={timetableFrameId} />}
    />
  );
}

function MainTimetable({ timetableFrameId }: { timetableFrameId: number }) {
  if (!isValidTimetableFrameId(timetableFrameId)) {
    return <InvalidMainTimetable />;
  }

  return <ValidMainTimetable timetableFrameId={timetableFrameId} />;
}

export default MainTimetable;
