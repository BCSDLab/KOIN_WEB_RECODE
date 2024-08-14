import { ReactComponent as CloseIcon } from 'assets/svg/modal-close-icon.svg';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './DetailImage.module.scss';

interface DetailModalProps {
  url: string | null;
  close: () => void;
}

export default function DetailModal({ url, close }: DetailModalProps): JSX.Element {
  const { backgroundRef } = useOutsideClick({ onOutsideClick: close });
  useEscapeKeyDown({ onEscape: close });
  useBodyScrollLock();

  if (!url) return <div />;

  return (
    <div className={styles.photo} ref={backgroundRef}>
      <button
        type="button"
        aria-label="닫기"
        className={styles.photo__close}
        onClick={close}
      >
        <CloseIcon />
      </button>
      <img src={url} alt="mealDetail" />
    </div>
  );
}
