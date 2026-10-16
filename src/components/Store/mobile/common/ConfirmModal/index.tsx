import type { ReactNode } from 'react';

import { cn } from '@bcsdlab/utils';
import CenterModal from 'components/Store/mobile/common/CenterModal';
import Button from 'components/ui/Button';

import styles from './ConfirmModal.module.scss';

// KOIN_ORDER_WEBVIEW 가운데 확인 모달(ModalContent + 회색·주황 버튼 한 쌍) 공용.
// 화면마다 다른 계산값은 variant로 고른다
interface ConfirmModalProps {
  isOpen: boolean;
  // 배경을 눌렀을 때
  onClose: () => void;
  message: ReactNode;
  cancelLabel: string;
  confirmLabel: string;
  // 왼쪽(회색) 버튼. 없으면 onClose
  onCancel?: () => void;
  onConfirm: () => void;
  isConfirmDisabled?: boolean;
  // center: 블록 + 가운데 정렬, column: 세로 flex로 줄마다 가운데(text-align 없음)
  messageLayout?: 'center' | 'column';
  messageWeight?: 'regular' | 'medium';
  // 줄 간격 1.6(기본은 모달의 1.5)
  isMessageRelaxed?: boolean;
  messageClassName?: string;
  buttonWeight?: 'medium' | 'semibold';
  // bordered: 테두리 neutral-400, plain: 공용 gray 그대로, dark: 글자 neutral-600
  cancelTone?: 'bordered' | 'plain' | 'dark';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  message,
  cancelLabel,
  confirmLabel,
  onCancel = onClose,
  onConfirm,
  isConfirmDisabled = false,
  messageLayout = 'center',
  messageWeight = 'regular',
  isMessageRelaxed = false,
  messageClassName,
  buttonWeight = 'medium',
  cancelTone = 'bordered',
}: ConfirmModalProps) {
  const buttonClassName = cn({
    [styles.confirm__button]: true,
    [styles['confirm__button--semibold']]: buttonWeight === 'semibold',
  });

  return (
    <CenterModal isOpen={isOpen} onClose={onClose}>
      <div className={styles.confirm}>
        <div
          className={cn({
            [styles.confirm__message]: true,
            [styles[`confirm__message--${messageLayout}`]]: true,
            [styles['confirm__message--medium']]: messageWeight === 'medium',
            [styles['confirm__message--relaxed']]: isMessageRelaxed,
            [messageClassName ?? '']: !!messageClassName,
          })}
        >
          {message}
        </div>
        <div className={styles.confirm__buttons}>
          <Button
            size="lg"
            color="gray"
            fullWidth
            className={cn({
              [buttonClassName]: true,
              [styles[`confirm__button--${cancelTone}`]]: cancelTone !== 'plain',
            })}
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            size="lg"
            color="primary"
            fullWidth
            className={buttonClassName}
            onClick={onConfirm}
            state={isConfirmDisabled ? 'disabled' : 'default'}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </CenterModal>
  );
}
