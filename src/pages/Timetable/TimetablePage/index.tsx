import React from 'react';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { MobilePage } from 'pages/Timetable/TimetablePage/MobilePage';
// import { ReactComponent as LoadingSpinner } from 'assets/svg/loading-spinner.svg';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import styles from './TimetablePage.module.scss';
import DefaultPage from './DefaultPage';

function TimetablePage() {
  const isMobile = useMediaQuery();
  useScrollToTop();

  return (
    <div className={styles.page}>
      {!isMobile ? (
        <DefaultPage />
      ) : (
        <MobilePage />
      ) }
    </div>
  );
}

export default TimetablePage;
