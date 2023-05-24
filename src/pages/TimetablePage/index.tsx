import React from 'react';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import DefaultPage from 'components/TimetablePage/DefaultPage';
import styles from './TimetablePage.module.scss';

function MobilePage() {
  return (
    <>
      asdf
    </>
  );
}

function TimetablePage() {
  const isMobile = useMediaQuery();
  return (
    <div className={styles.page}>
      {isMobile ? <MobilePage /> : <DefaultPage />}
    </div>
  );
}

export default TimetablePage;
