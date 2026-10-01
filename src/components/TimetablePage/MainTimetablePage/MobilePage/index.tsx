import React, { useEffect } from 'react';
import Link from 'next/link';

import TimetableDownloadIcon from 'assets/svg/timetable-download-icon.svg';
import Timetable from 'components/TimetablePage/components/Timetable';
import useResetInvalidSemester from 'components/TimetablePage/hooks/useResetInvalidSemester';
import useTimetableFrameList from 'components/TimetablePage/hooks/useTimetableFrameList';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useImageDownload from 'utils/hooks/ui/useImageDownload';
import showToast from 'utils/ts/showToast';
import { useSemester } from 'utils/zustand/semester';

import styles from './MobilePage.module.scss';

interface MobilePageProps {
  timetableFrameId: number;
  setCurrentFrameId?: (index: number) => void;
}

// 학기 목록 로딩이 화면을 막지 않도록 Suspense 안에서 따로 실행한다.
function SemesterGuard() {
  useResetInvalidSemester();

  return null;
}

function MobilePage({ timetableFrameId, setCurrentFrameId }: MobilePageProps) {
  const logger = useLogger();
  const semester = useSemester();
  const { data } = useTimetableFrameList(semester);
  const { onImageDownload: onTimetableImageDownload, divRef: timetableRef } = useImageDownload();
  const handleImageDownloadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logger.actionEventClick({
      team: 'USER',
      event_label: 'timetable_imageDownload_click',
      value: '시간표 저장',
    });
    onTimetableImageDownload('my-timetable');
  };

  useEffect(() => {
    if (!setCurrentFrameId) return;
    if (!data.find((frame) => frame.id === timetableFrameId)) {
      const mainFrameId = data.find((frame) => frame.is_main)?.id;
      if (mainFrameId) setCurrentFrameId(mainFrameId);
    }
  }, [data, setCurrentFrameId, timetableFrameId]);

  const currentFrame = data.find((frame) => frame.id === timetableFrameId) ?? data.find((frame) => frame.is_main);
  const semesterLabel = [semester && `${semester.year}년 ${semester.term}`, currentFrame?.name]
    .filter(Boolean)
    .join(' / ');

  const handleTimetableClick = () => {
    showToast('info', 'PC환경만 지원합니다. PC를 이용해주세요.');
  };

  return (
    <div className={styles.page}>
      <React.Suspense fallback={null}>
        <SemesterGuard />
      </React.Suspense>
      <div className={styles.page__header}>
        <Link href={ROUTES.TimetableList()} className={styles.page__semester}>
          {semesterLabel}
        </Link>
        <button type="button" className={styles.page__button} onClick={handleImageDownloadClick}>
          시간표 다운로드
          <TimetableDownloadIcon />
        </button>
      </div>
      <div
        ref={timetableRef}
        className={styles.page__timetable}
        role="button"
        tabIndex={0}
        aria-label="시간표"
        onClick={handleTimetableClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleTimetableClick();
        }}
      >
        <Timetable
          timetableFrameId={timetableFrameId}
          columnWidth={62}
          firstColumnWidth={17}
          rowHeight={35}
          totalHeight={716}
        />
      </div>
    </div>
  );
}

export { MobilePage };
