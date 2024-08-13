import styles from './ToggleButton.module.scss';

interface ToggleButtonProps {
  width: string,
  height: string,
}

function ToggleButton({ width, height } : ToggleButtonProps) {
  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <input type="checkbox" className={styles.button} />
    </div>
  );
}

export default ToggleButton;
