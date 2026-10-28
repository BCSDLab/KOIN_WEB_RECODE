import type { ReactNode } from 'react';

import { cn } from '@bcsdlab/utils';
import CenterModal from 'components/Store/mobile/common/CenterModal';
import Button from 'components/ui/Button';

import styles from './AlertModal.module.scss';

// KOIN_ORDER_WEBVIEW 가운데 안내 모달(ModalContent + 확인 버튼 하나) 공용.
// 화면마다 다른 계산값은 variant로 고른다
interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: ReactNode;
  // 확인 버튼. 없으면 onClose
  onConfirm?: () => void;
  confirmLabel?: string;
  messageWeight?: 'regular' | 'medium';
  // 줄 간격 1.6(기본은 모달의 1.5)
  isMessageRelaxed?: boolean;
  // 서버 문구의 줄바꿈(\n)을 살린다
  isMessagePreLine?: boolean;
  // flat: 그림자 없음·굵기 500, raised: 공용 Button 그림자·굵기 그대로
  buttonVariant?: 'flat' | 'raised';
}

export default function AlertModal({
  isOpen,
  onClose,
  message,
  onConfirm = onClose,
  confirmLabel = '확인',
  messageWeight = 'regular',
  isMessageRelaxed = false,
  isMessagePreLine = false,
  buttonVariant = 'raised',
}: AlertModalProps) {
  return (
    <CenterModal isOpen={isOpen} onClose={onClose}>
      <div className={styles.alert}>
        <div
          className={cn({
            [styles.alert__message]: true,
            [styles['alert__message--medium']]: messageWeight === 'medium',
            [styles['alert__message--relaxed']]: isMessageRelaxed,
            [styles['alert__message--pre-line']]: isMessagePreLine,
          })}
        >
          {message}
        </div>
        <Button
          size="lg"
          color="primary"
          fullWidth
          className={cn({
            [styles.alert__button]: true,
            [styles['alert__button--flat']]: buttonVariant === 'flat',
          })}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </CenterModal>
  );
}
