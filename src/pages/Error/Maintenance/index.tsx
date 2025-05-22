import styles from './Maintenance.module.scss';

export default function Maintenance() {
  return (
    <div className={styles.layout}>
      <h1>서비스 점검 중입니다.</h1>
      <p>서비스 점검이 진행되고 있습니다. 잠시 후 다시 시도해 주세요.</p>
    </div>
  );
}
