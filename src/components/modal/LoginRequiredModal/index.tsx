import { useRouter } from 'next/router';
import CloseIcon from 'assets/svg/close-icon-grey.svg';
import ROUTES from 'static/routes';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { setRedirectPath } from 'utils/ts/auth';
import styles from './LoginRequiredModal.module.scss';

interface LoginRequiredProps {
  title: string;
  description: string;
  onClose: () => void;
  onLoginClick?: () => void;
  onCancelClick?: () => void;
  enableRedirect?: boolean;
}
export default function LoginRequiredModal({
  title,
  description,
  onClose,
  onLoginClick,
  onCancelClick,
  enableRedirect = true,
}: LoginRequiredProps) {
  const router = useRouter();
  const { backgroundRef } = useOutsideClick({ onOutsideClick: onClose });

  const sentences = description.split('.');

  const goLogin = () => {
    if (onLoginClick) onLoginClick();
    if (enableRedirect) setRedirectPath(`${router.asPath}${router.query}`);
    onClose();
    router.push(ROUTES.Auth());
  };

  const cancel = () => {
    if (onCancelClick) onCancelClick();
    onClose();
  };

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.container}>
        <button className={styles.container__icon} type="button" aria-label="닫기 버튼" onClick={onClose}>
          <CloseIcon />
        </button>
        <div className={styles.container__header}>
          <div className={styles.container__title}>
            {title}
            <div>위해 로그인이 필요해요.</div>
          </div>
          <div className={styles.container__detail}>
            {sentences.map((sentence, index) => (
              <div key={`${sentence}-${String(index)}`}>
                {sentence}
                {index < sentences.length - 1 && '.'}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.container__button}>
          <button type="button" className={styles['container__button--login']} onClick={goLogin}>
            로그인하기
          </button>
          <button type="button" className={styles['container__button--cancel']} onClick={cancel}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
