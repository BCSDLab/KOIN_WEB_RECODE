import { useRouter } from 'next/router';

import CenterModal from 'components/Store/mobile/common/CenterModal';
import Button from 'components/ui/Button';
import ROUTES from 'static/routes';

import styles from './LoginRequiredModal.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/components/LoginRequiredModal 이전.
// 로그인하기는 WEB_RECODE 로그인 화면으로 현재 경로를 redirect 쿼리에 담아 보낸다
interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subTitle?: string;
}

export default function LoginRequiredModal({
  isOpen,
  onClose,
  title = ' 코인 주문을 이용하기 위해선\n로그인이 필요해요',
  subTitle = '로그인 후 코인의 주문 기능을\n이용해보세요!',
}: LoginRequiredModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    router.push(`${ROUTES.Auth()}?redirect=${encodeURIComponent(router.asPath)}`);
  };

  return (
    <CenterModal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.content__text}>
          <div className={styles.content__title}>{title}</div>
          <div className={styles.content__subtitle}>{subTitle}</div>
        </div>
        <div className={styles.content__buttons}>
          <Button
            size="lg"
            color="gray"
            fullWidth
            className={`${styles.content__button} ${styles['content__button--close']}`}
            onClick={onClose}
          >
            닫기
          </Button>
          <Button size="lg" color="primary" fullWidth className={styles.content__button} onClick={handleLogin}>
            로그인하기
          </Button>
        </div>
      </div>
    </CenterModal>
  );
}
