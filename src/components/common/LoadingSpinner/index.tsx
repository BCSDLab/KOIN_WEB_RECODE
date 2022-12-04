import styles from './LoadingSpinner.module.scss';

interface LoadingSpinnerProps {
  size: string
}

function LoadingSpinner(props: LoadingSpinnerProps) {
  const { size } = props;
  return (
    <div
      className={styles['loading-wrapper']}
      style={{
        width: `${size}`,
        height: `${size}`,
      }}
    >
      <div className={styles['loading-div']} style={{ width: `${size}`, height: `${size}` }} />
      <div className={styles['loading-div']} style={{ width: `${size}`, height: `${size}` }} />
      <div className={styles['loading-div']} style={{ width: `${size}`, height: `${size}` }} />
      <div className={styles['loading-div']} style={{ width: `${size}`, height: `${size}` }} />
    </div>
  );
}

export default LoadingSpinner;
