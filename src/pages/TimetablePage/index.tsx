import React from 'react';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { MobilePage } from 'pages/TimetablePage/MobilePage';
// import { ReactComponent as LoadingSpinner } from 'assets/svg/loading-spinner.svg';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import styles from './TimetablePage.module.scss';
import DefaultPage from './DefaultPage';

function TimetablePage() {
  const isMobile = useMediaQuery();
  useScrollToTop();
  sessionStorage.setItem('enterTimetablePage', new Date().getTime().toString());

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
