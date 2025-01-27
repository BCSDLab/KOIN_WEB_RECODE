import React from 'react';
import ErrorBoundary from 'components/common/ErrorBoundary';
import LoadingSpinner from 'assets/svg/loading-spinner.svg';
import showToast from 'utils/ts/showToast';
import Timetable from 'pages/TimetablePage/components/Timetable';
import SemesterListbox from 'pages/TimetablePage/components/SemesterList';
import useLogger from 'utils/hooks/analytics/useLogger';
import useImageDownload from 'utils/hooks/ui/useImageDownload';
import styles from './MobilePage.module.scss';

function MobilePage({ frameId }: { frameId: number }) {
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
        <div className={styles.page__header}>
          <div className={styles.page__semester}>
            <React.Suspense
              fallback={(
                <div className={styles['dropdown-loading-spinner']}>
                  <LoadingSpinner />
                </div>
              )}
            >
              <SemesterListbox />
            </React.Suspense>
          </div>
          <button
            type="button"
            className={styles.page__button}
            onClick={(e) => handleImageDownloadClick(e)}
          >
            <img
              src="https://static.koreatech.in/assets/img/ic-image.png"
              alt="이미지"
            />
            이미지로 저장하기
          </button>
        </div>
        <div ref={timetableRef} className={styles.page__timetable}>
          <ErrorBoundary fallbackClassName="loading">
            <React.Suspense
              fallback={(
                <div className={styles['top-loading-spinner']}>
                  <LoadingSpinner />
                </div>
              )}
            >
              <Timetable
                frameId={frameId}
                columnWidth={55}
                firstColumnWidth={52}
                rowHeight={21}
                totalHeight={439}
              />
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
