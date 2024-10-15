import CloseIcon from 'assets/svg/modal-close-icon.svg';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './LoginPromptModal.module.scss';

interface LoginPromptModalProps {
  action: () => void;
  closeModal: () => void;
}

export default function LoginPromptModal({
  action, closeModal,
}: LoginPromptModalProps): JSX.Element {
  const { backgroundRef } = useOutsideClick({ onOutsideClick: closeModal });
  useEscapeKeyDown({ onEscape: closeModal });
  useBodyScrollLock();

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.modal}>
        <div className={styles['modal-top']}>
          <button
            type="button"
            aria-label="닫기"
            className={styles['modal-top__close']}
            onClick={() => closeModal()}
          >
            <CloseIcon />
          </button>
        </div>
        <div className={styles['modal-middle']}>
          <span className={styles['modal-middle__bold']}>
            더 맛있는 학식을 먹는 방법,
            <br />
            로그인 후 좋아요 남기기!
          </span>
          <span className={styles['modal-middle__thin']}>
            여러분의 의견은 영양사님이 더 맛있는
            <br />
            학식을 제공하는데 큰 도움이 됩니다.
          </span>
        </div>
        <div className={styles['modal-bottom']}>
          <button
            type="button"
            className={styles['modal-bottom__login']}
            onClick={action}
          >
            로그인하기
          </button>
          <button
            type="button"
            className={styles['modal-bottom__cancel']}
            onClick={closeModal}
          >
            다음에 하기
          </button>
        </div>
      </div>
    </div>
  );
}
