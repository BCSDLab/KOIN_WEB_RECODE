import CloseIcon from 'assets/svg/tooltip-close-icon.svg';
import styles from './IntroToolTip.module.scss';

interface IntroToolTipProps {
  content: string;
  closeTooltip: () => void;
}

export default function IntroToolTip({ content, closeTooltip }: IntroToolTipProps) {
  const handleTooltipCloseButtonClick = () => {
    localStorage.setItem('store-review-tooltip', 'used');
    closeTooltip();
  };
  return (
    <div className={styles.tooltip}>
      {content}
      <button type="button" className={styles['close-button']} onClick={() => handleTooltipCloseButtonClick()}>
        <CloseIcon />
      </button>
    </div>
  );
}
