import React, { useEffect } from 'react';
import Image from 'next/image';
import LoadingSpinner from 'assets/svg/loading-spinner.svg';
import SemesterListbox from 'components/TimetablePage/components/SemesterList';
import Timetable from 'components/TimetablePage/components/Timetable';
import useTimetableFrameList from 'components/TimetablePage/hooks/useTimetableFrameList';
import useLogger from 'utils/hooks/analytics/useLogger';
import useTokenState from 'utils/hooks/state/useTokenState';
import useImageDownload from 'utils/hooks/ui/useImageDownload';
import showToast from 'utils/ts/showToast';
import { useSemester } from 'utils/zustand/semester';
import styles from './MobilePage.module.scss';

interface MobilePageProps {
  timetableFrameId: number;
  setCurrentFrameId?: (index: number) => void;
}

function MobilePage({ timetableFrameId, setCurrentFrameId }: MobilePageProps) {
  const logger = useLogger();
  const semester = useSemester();
  const token = useTokenState();
  const { data } = useTimetableFrameList(token, semester);
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

  return (
    <>
      <div className={styles['page__timetable-wrap']}>
        <div className={styles.page__header}>
          <div className={styles.page__semester}>
            <React.Suspense
              fallback={
                <div className={styles['dropdown-loading-spinner']}>
                  <LoadingSpinner />
                </div>
              }
            >
              <SemesterListbox />
            </React.Suspense>
          </div>
          <button type="button" className={styles.page__button} onClick={(e) => handleImageDownloadClick(e)}>
            <Image
              src="https://static.koreatech.in/assets/img/ic-image.png"
              alt="이미지"
              width={24}
              height={24}
              loading="lazy"
            />
            이미지로 저장하기
          </button>
        </div>
        <div ref={timetableRef} className={styles.page__timetable}>
          <Timetable
            timetableFrameId={timetableFrameId}
            columnWidth={55}
            firstColumnWidth={52}
            rowHeight={21}
            totalHeight={439}
          />
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
