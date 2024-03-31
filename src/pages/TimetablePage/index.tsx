import React from 'react';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import { DefaultPage } from 'components/TimetablePage/DefaultPage';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import styles from './TimetablePage.module.scss';

function MobilePage() {
  return (
    <div style={{
      height: '50vh', display: 'flex', alignItems: 'center', textAlign: 'center', flexWrap: 'nowrap', justifyContent: 'center',
    }}
    >
      시간표 기능은 모바일 환경을 지원하지 않습니다.
      <br />
      안드로이드 앱과 PC 환경에서 이용해주세요.
    </div>
  );
}

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
