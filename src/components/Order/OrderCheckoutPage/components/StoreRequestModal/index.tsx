import { useRef, useState, type ChangeEvent } from 'react';

import { cn } from '@bcsdlab/utils';
import CloseIcon from 'assets/svg/Order/Checkout/close-icon.svg';
import BottomModal, {
  BottomModalContent,
  BottomModalFooter,
  BottomModalHeader,
} from 'components/Store/mobile/common/BottomModal';
import Button from 'components/ui/Button';

import sheetStyles from 'components/Order/OrderCheckoutPage/components/CheckoutSheet.module.scss';
import styles from './StoreRequestModal.module.scss';

// KOIN_ORDER_WEBVIEW pages/Payment/components/StoreRequestModal 이전(사장님 요청사항·수저 여부). 요청사항은 30자까지
const MAX_REQUEST_LENGTH = 30;

interface StoreRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRequest: string;
  currentNoCutlery: boolean;
  onSubmit: (request: string, noCutlery: boolean) => void;
}

export default function StoreRequestModal({
  isOpen,
  onClose,
  currentRequest,
  currentNoCutlery,
  onSubmit,
}: StoreRequestModalProps) {
  const [request, setRequest] = useState(currentRequest);
  const [noCutlery, setNoCutlery] = useState(currentNoCutlery);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleButtonClick = () => {
    onSubmit(request, noCutlery);
    onClose();
  };

  const handleChangeRequest = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value.trimStart();
    if (input.length <= MAX_REQUEST_LENGTH) setRequest(input);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  return (
    <BottomModal className={sheetStyles.sheet} isOpen={isOpen} onClose={onClose}>
      <BottomModalHeader className={sheetStyles.sheet__section}>
        <div className={sheetStyles.sheet__title}>사장님에게</div>
        <button type="button" onClick={onClose}>
          <CloseIcon />
        </button>
      </BottomModalHeader>
      <BottomModalContent className={cn({ [sheetStyles.sheet__section]: true, [styles.content]: true })}>
        <div>
          <textarea
            value={request}
            onChange={handleChangeRequest}
            placeholder="예)매운맛 조금만 해주세요"
            className={styles.textarea}
            rows={1}
            ref={textareaRef}
          />
          <div className={cn({ [styles.counter]: true, [styles['counter--filled']]: !!request })}>
            {request.length}
            /30
          </div>
        </div>
        <label className={styles.cutlery}>
          <input
            type="checkbox"
            checked={noCutlery}
            onChange={() => setNoCutlery((prev) => !prev)}
            className={styles.cutlery__checkbox}
          />
          일회용 수저, 포크는 빼 주세요
        </label>

        <Button size="lg" onClick={handleButtonClick} className={styles.save}>
          저장하기
        </Button>
      </BottomModalContent>
      <BottomModalFooter className={sheetStyles.sheet__section} />
    </BottomModal>
  );
}
