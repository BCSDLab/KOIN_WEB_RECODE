import { useLocation, useNavigate } from 'react-router-dom';
import useLogger from 'utils/hooks/analytics/useLogger';
import ROUTES from 'static/routes';
import { setRedirectPath } from 'utils/ts/auth';
import styles from './LoginRequiredModal.module.scss';

interface Props {
  title: string;
  description:string;
  closeModal:()=>void;
  type?: string;
  shopName?: string;
}

export default function LoginRequiredModal({
  title = '', description = '', closeModal, type, shopName,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const logger = useLogger();

  const loggingLoginClick = () => {
    if (shopName) {
      logger.actionEventClick({
        actionTitle: 'BUSINESS',
        event_label: `shop_detail_view_review_${type}_login`,
        value: shopName,
        event_category: 'click',
      });
    }
  };

  const loggingCancelClick = () => {
    if (shopName) {
      logger.actionEventClick({
        actionTitle: 'BUSINESS',
        event_label: `shop_detail_view_review_${type}_cancel`,
        value: shopName,
        event_category: 'click',
      });
    }
  };

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
          <button
            type="button"
            onClick={() => {
              loggingCancelClick();
              closeModal();
            }}
          >
            취소하기
          </button>
          <button
            type="button"
            onClick={() => {
              setRedirectPath(`${location.pathname}${location.search}`);
              loggingLoginClick();
              navigate(ROUTES.Auth());
            }}
          >
            로그인하기
          </button>
        </div>
      </div>
    </div>
  );
}
