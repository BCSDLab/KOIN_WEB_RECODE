import styles from './MarkerIcon.module.scss';

function MarkerIcon() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.icon} />
      <div className={styles.pluse} />
    </div>
  );
}

export default MarkerIcon;
