import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import BusGuide from 'pages/Bus/components/BusGuide';
import BusLookup from 'pages/Bus/BusLookupPage/components/BusLookup';
import DirectionSelect from 'pages/Bus/BusLookupPage/components/DirectionSelect';
import styles from './BusLookupPage.module.scss';

function BusLookupPage() {
  // params 어떻게 받아올 지 고민
  // params를 DirectionSelect로 넘겨주기, DirectionSelect 기능 축소

  useScrollToTop();

  return (
    <main>
      <div className={styles.container}>
        <BusGuide />
        <div className={styles.direction}>
          <div className={styles.notice}>
            <p className={styles.notice__description}>현재는 정규학기(12월 20일까지)의 시간표를 제공하고 있어요.</p>
          </div>
          <DirectionSelect />
        </div>
        <BusLookup />
      </div>
    </main>
  );
}

export default BusLookupPage;
