import styles from './FoundToggle.module.scss';

interface FoundToggleProps {
  onToggle: () => void;
  disabled?: boolean;
  type: string;
}

export default function FoundToggle({ onToggle, disabled = false, type }: FoundToggleProps) {
  return (
    <div className={styles['found-toggle']}>
      <span className={styles['found-toggle__label']}>
        {type === 'FOUND' ? '주인을 찾았나요?' : '물건을 찾았나요?'}
      </span>
      <button
        type="button"
        className={styles['found-toggle__button']}
        onClick={onToggle}
        disabled={disabled}
        aria-label="찾음으로 변경"
      >
        <div className={styles['found-toggle__track']}>
          <div className={styles['found-toggle__thumb']} />
        </div>
      </button>
    </div>
  );
}
