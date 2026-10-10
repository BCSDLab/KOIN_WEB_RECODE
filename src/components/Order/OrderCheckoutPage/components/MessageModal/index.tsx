import { cn } from '@bcsdlab/utils';
import CenterModal from 'components/Store/mobile/common/CenterModal';
import Button from 'components/ui/Button';

import styles from './MessageModal.module.scss';

// KOIN_ORDER_WEBVIEW pages/Payment/components/PaymentFailModal·AddressModal 이전.
// 가운데 모달(ModalContent)에 안내 문구와 확인 버튼을 띄운다. 배달지 안내(AddressModal)는 줄 간격이 160%다
interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  isRelaxed?: boolean;
}

export default function MessageModal({ isOpen, onClose, message, isRelaxed = false }: MessageModalProps) {
  return (
    <CenterModal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <div
          className={cn({
            [styles.content__message]: true,
            [styles['content__message--relaxed']]: isRelaxed,
          })}
        >
          {message}
        </div>
        <Button size="lg" fullWidth className={styles.content__button} onClick={onClose}>
          확인
        </Button>
      </div>
    </CenterModal>
  );
}
