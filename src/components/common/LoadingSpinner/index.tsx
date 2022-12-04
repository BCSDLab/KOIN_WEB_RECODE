import styles from './LoadingSpinner.module.scss';

interface LoadingSpinnerProps {
  width: string
  height: string
}

function LoadingSpinner(props: LoadingSpinnerProps) {
  const { width, height } = props;
  return (
    <div
      className={styles['loading-wrapper']}
      style={{
        width: `${width}`,
        height: `${height}`,
      }}
    >
      <div className={styles['loading-div']} style={{ width: `${width}`, height: `${height}` }} />
      <div className={styles['loading-div']} style={{ width: `${width}`, height: `${height}` }} />
      <div className={styles['loading-div']} style={{ width: `${width}`, height: `${height}` }} />
      <div className={styles['loading-div']} style={{ width: `${width}`, height: `${height}` }} />
    </div>
  );
}

export default LoadingSpinner;
