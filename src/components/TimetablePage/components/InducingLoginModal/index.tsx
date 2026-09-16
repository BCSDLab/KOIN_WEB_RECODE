import { useRouter } from 'next/router';

import ROUTES from 'static/routes';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';

import styles from './InducingLoginModal.module.scss';

interface InducingLoginModalProps {
  actionTitle: string;
  detailExplanation: string;
  onClose: () => void;
}

function InducingLoginModal({ actionTitle, detailExplanation, onClose }: InducingLoginModalProps) {
  const router = useRouter();
  const { backgroundRef } = useOutsideClick({ onOutsideClick: onClose });

  const sentences = detailExplanation.split('.');

  const goLogin = () => {
    onClose();
    router.push(ROUTES.Auth());
  };

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.container}>
        <div className={styles.container__title}>
          {`${actionTitle} 시 `}
          <span className={styles['container__title--login-text']}>로그인</span>을 해주세요.
        </div>
        <div className={styles.container__detail}>
          {sentences.map((sentence, index) => (
            // eslint-disable-next-line react/no-array-index-key -- 고정 문자열을 '.'로 분리한 정적 목록이라 재정렬/삽입이 없다.
            <div key={index}>
              {sentence}
              {index < sentences.length - 1 && '.'}
            </div>
          ))}
        </div>
        <div className={styles.container__button}>
          <button type="button" className={styles['container__button--cancel']} onClick={onClose}>
            취소하기
          </button>
          <button type="button" className={styles['container__button--login']} onClick={goLogin}>
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default InducingLoginModal;
