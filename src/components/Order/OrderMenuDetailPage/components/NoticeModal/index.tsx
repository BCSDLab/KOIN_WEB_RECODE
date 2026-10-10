import CenterModal from 'components/Store/mobile/common/CenterModal';
import Button from 'components/ui/Button';

import styles from './NoticeModal.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/components/NoticeModal 이전. 서버 안내 문구를 그대로 보여 주고 확인으로 닫는다
interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function NoticeModal({ isOpen, onClose, message }: NoticeModalProps) {
  return (
    <CenterModal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.content__inner}>
          <div className={styles.content__message}>{message}</div>
          <Button size="lg" color="primary" className={styles.content__button} onClick={onClose}>
            확인
          </Button>
        </div>
      </div>
    </CenterModal>
  );
}
