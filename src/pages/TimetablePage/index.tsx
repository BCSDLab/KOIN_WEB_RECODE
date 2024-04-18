import React from 'react';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import { MobilePage } from 'components/TimetablePage/MobilePage';
import { DefaultPage } from 'components/TimetablePage/DefaultPage';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import styles from './TimetablePage.module.scss';

function TimetablePage() {
  const isMobile = useMediaQuery();
  useScrollToTop();
  return (
    <div className={styles.page}>
      {isMobile ? <MobilePage /> : <DefaultPage />}
    </div>
  );
}

export default TimetablePage;
