import { useNavigate } from 'react-router-dom';
import styles from './InducingLoginModal.module.scss';

interface InducingLoginModalProps {
  actionTitle: string;
  detailExplanation: string;
  onClose: () => void;
}

function InducingLoginModal({ actionTitle, detailExplanation, onClose }: InducingLoginModalProps) {
  const sentences = detailExplanation.split('.');
  const navigate = useNavigate();

  const goLogin = () => {
    onClose();
    navigate('/auth');
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.container__title}>
          {`${actionTitle} 시 ` }
          <span className={styles['container__title--login-text']}>로그인</span>
          을 해주세요.
        </div>
        <div className={styles.container__detail}>
          {sentences.map((sentence, index) => (
            <div>
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
