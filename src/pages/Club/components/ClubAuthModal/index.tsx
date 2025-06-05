import { useNavigate } from 'react-router-dom';
import ROUTES from 'static/routes';
import styles from './ClubAuthModal.module.scss';

interface ClubAuthModalProps {
  closeModal: () => void;
}

function ClubAuthModal({ closeModal }: ClubAuthModalProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.container__notice}>
          <h4 className={styles['container__notice--title']}>
            로그인이 필요한 기능입니다.
          </h4>
          <div className={styles['container__notice--description']}>로그인 하시겠어요?</div>
        </div>
        <div className={styles.container__button}>
          <button
            type="button"
            className={styles['container__button--login']}
            onClick={() => {
              navigate(ROUTES.Auth());
              closeModal();
            }}
          >
            로그인하기
          </button>
          <button
            type="button"
            className={styles['container__button--back']}
            onClick={() => closeModal()}
          >
            취소하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClubAuthModal;
