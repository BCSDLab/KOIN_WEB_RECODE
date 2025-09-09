import { useArticlesLogger } from 'components/Articles/hooks/useArticlesLogger';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import CloseIcon from 'assets/svg/close-icon-grey.svg';
import { useRouter } from 'next/router';
import styles from './LoginRequireLostItemModal.module.scss';

interface LoginRequireLostItemModalProps {
  actionTitle: string;
  detailExplanation: string;
  onClose: () => void;
}

function LoginRequireLostItemModal(
  {
    actionTitle,
    detailExplanation,
    onClose,
  }: LoginRequireLostItemModalProps,
) {
  const { logLoginRequire } = useArticlesLogger();
  const router = useRouter();
  const { backgroundRef } = useOutsideClick({ onOutsideClick: onClose });

  const sentences = detailExplanation.split('.');

  const goLogin = () => {
    if (actionTitle === '게시글을 작성하려면') {
      logLoginRequire('게시글 작성 팝업');
    } else if (actionTitle === '쪽지를 보내려면') {
      logLoginRequire('쪽지 보내기 팝업');
    }
    onClose();
    router.push('/auth');
  };

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.container}>
        <button
          className={styles.container__icon}
          type="button"
          aria-label="닫기 버튼"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
        <div className={styles.container__header}>
          <div className={styles.container__title}>
            {actionTitle}
            <div>로그인이 필요해요.</div>
          </div>
          <div className={styles.container__detail}>
            {sentences.map((sentence, index) => (
              <div>
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
          <button type="button" className={styles['container__button--cancel']} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginRequireLostItemModal;
