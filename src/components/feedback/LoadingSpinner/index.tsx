import styles from './LoadingSpinner.module.scss';

interface LoadingSpinnerProps {
  size: string;
}

export default function LoadingSpinner({ size }: LoadingSpinnerProps) {
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
