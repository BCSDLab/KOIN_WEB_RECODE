import styles from './ToggleButton.module.scss';

interface ToggleButtonProps {
  width: string;
  height: string;
  handleToggle: () => void;
}

function ToggleButton({ width, height, handleToggle }: ToggleButtonProps) {
  // 적정 '너비:높이'는 '2:1'입니다.
  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      <input type="checkbox" className={styles.button} onClick={handleToggle} />
    </div>
  );
}

export default ToggleButton;
