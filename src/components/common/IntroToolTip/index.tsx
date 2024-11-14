/* eslint-disable jsx-a11y/control-has-associated-label */
import CloseIcon from 'assets/svg/tooltip-close-icon.svg';
import styles from './IntroToolTip.module.scss';

interface IntroToolTipProps {
  content:string;
  setCloseState: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function IntroToolTip({ content, setCloseState } : IntroToolTipProps) {
  return (
    <div className={styles.tooltip}>
      {content}
      <button type="button" className={styles['close-button']} onClick={() => setCloseState(false)}>
        <CloseIcon />
      </button>
    </div>
  );
}
