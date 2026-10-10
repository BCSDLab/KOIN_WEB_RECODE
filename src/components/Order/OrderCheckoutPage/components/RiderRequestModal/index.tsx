import { useRef, useState, type ChangeEvent } from 'react';

import { cn } from '@bcsdlab/utils';
import { useQuery } from '@tanstack/react-query';
import { orderQueries } from 'api/order/queries';
import CloseIcon from 'assets/svg/Order/Checkout/close-icon.svg';
import BottomModal, {
  BottomModalContent,
  BottomModalFooter,
  BottomModalHeader,
} from 'components/Store/mobile/common/BottomModal';
import Button from 'components/ui/Button';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';

import sheetStyles from 'components/Order/OrderCheckoutPage/components/CheckoutSheet.module.scss';
import styles from './RiderRequestModal.module.scss';

// KOIN_ORDER_WEBVIEW pages/Payment/components/RiderRequestModal 이전(배달기사님 요청사항).
// 서버가 내려 준 문구 중 하나를 고르거나 직접 입력한다(30자). order처럼 화면에 늘 붙어 있어 문구를 미리 받는다
const MAX_REQUEST_LENGTH = 30;

interface RiderRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValue: string;
  onSubmit: (finalValue: string) => void;
}

interface RadioProps {
  checked: boolean;
  onChange: () => void;
  isWhite?: boolean;
}

function Radio({ checked, onChange, isWhite = false }: RadioProps) {
  return (
    <div className={styles.radio}>
      <input
        type="radio"
        name="request"
        checked={checked}
        onChange={onChange}
        className={cn({ [styles.radio__input]: true, [styles['radio__input--white']]: isWhite })}
      />
      <div className={styles.radio__dot} />
    </div>
  );
}

export default function RiderRequestModal({ isOpen, onClose, initialValue, onSubmit }: RiderRequestModalProps) {
  const isLoggedIn = useIsLoggedIn();
  const { data } = useQuery(orderQueries.riderMessages(isLoggedIn));
  const requestList = data?.contents.map((item) => item.content) ?? [];
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [requestValue, setRequestValue] = useState(initialValue);
  const [isCustomSelected, setIsCustomSelected] = useState(() => !requestList.includes(initialValue));

  const handleSelect = (value: string) => {
    setIsCustomSelected(false);
    setRequestValue(value);
  };

  const handleCustomSelect = () => {
    setIsCustomSelected(true);
    setRequestValue('');
  };

  const handleClickButton = () => {
    onSubmit(requestValue);
    onClose();
  };

  const handleChangeRequestValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value.trimStart();
    if (input.length <= MAX_REQUEST_LENGTH) setRequestValue(input);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  return (
    <BottomModal className={sheetStyles.sheet} isOpen={isOpen} onClose={onClose}>
      <BottomModalHeader className={sheetStyles.sheet__section}>
        <div className={styles.title}>배달기사님에게</div>
        <button type="button" onClick={onClose}>
          <CloseIcon />
        </button>
      </BottomModalHeader>

      <BottomModalContent className={cn({ [sheetStyles.sheet__section]: true, [styles.content]: true })}>
        <div className={styles.options}>
          {requestList.map((option) => {
            const isChecked = !isCustomSelected && requestValue === option;

            return (
              <label key={option} className={cn({ [styles.option]: true, [styles['option--checked']]: isChecked })}>
                <Radio checked={isChecked} onChange={() => handleSelect(option)} isWhite />
                <div className={styles.option__text}>{option}</div>
              </label>
            );
          })}

          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control -- order처럼 라디오(Radio 안의 input)를 label 안에 둔다 */}
          <label className={cn({ [styles.option]: true, [styles['option--checked']]: isCustomSelected })}>
            <Radio checked={isCustomSelected} onChange={handleCustomSelect} />
            <div className={styles.option__text}>직접 입력</div>
          </label>

          {isCustomSelected && (
            <div>
              <textarea
                value={requestValue}
                onChange={handleChangeRequestValue}
                placeholder="상세 요청사항을 입력해주세요."
                className={styles.textarea}
                rows={1}
                ref={textareaRef}
              />
              <div className={cn({ [styles.counter]: true, [styles['counter--filled']]: !!requestValue })}>
                {requestValue.length}
                /30
              </div>
            </div>
          )}
        </div>

        <Button onClick={handleClickButton} className={styles.select}>
          선택하기
        </Button>
      </BottomModalContent>

      <BottomModalFooter className={sheetStyles.sheet__section} />
    </BottomModal>
  );
}
