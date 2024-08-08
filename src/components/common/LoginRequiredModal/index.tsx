import { useLocation, useNavigate } from 'react-router-dom';
import { setRedirectPath } from 'utils/ts/auth';
import styles from './LoginRequiredModal.module.scss';

interface Props {
  title: string;
  description:string;
  closeModal:()=>void;
}

export default function LoginRequiredModal({ title = '', description = '', closeModal }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <div className={styles.modal__title}>
          {title}
          <span>로그인</span>
          을 해주세요.
        </div>
        <div className={styles.modal__description}>{description}</div>
        <div className={styles.modal__description}>회원가입 또는 로그인 후 이용해주세요 :-)</div>
        <div className={styles.modal__button}>
          <button type="button" onClick={closeModal}>취소하기</button>
          <button
            type="button"
            onClick={() => {
              setRedirectPath(`${location.pathname}`);
              navigate('/auth');
            }}
          >
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
}
