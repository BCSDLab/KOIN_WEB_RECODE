import styles from './DesktopNotice.module.scss';

// 주문 화면은 모바일 전용이다. 데스크톱 접근 시 서버가 확정한 기기 값으로 이 안내를 렌더한다
export default function DesktopNotice() {
  return (
    <div className={styles.notice}>
      <p className={styles.notice__title}>모바일에서 이용해 주세요</p>
      <p className={styles.notice__description}>주문 기능은 모바일 웹과 앱에서 이용할 수 있어요.</p>
    </div>
  );
}
