import styles from './BusGuide.module.scss';

export default function BusGuide() {
  return (
    <div className={styles.guide}>
      <h1 className={styles.guide__title}>버스</h1>
      <p className={styles.guide__description}>목적지까지 가장 빠른 교통편을 알려드릴게요.</p>
    </div>
  );
}
