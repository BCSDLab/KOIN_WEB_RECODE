import { useState } from 'react';

import { isKoinError } from '@bcsdlab/koin';
import { cn } from '@bcsdlab/utils';
import { useMutation } from '@tanstack/react-query';
import { orderMutations } from 'api/order/mutations';
import CloseIcon from 'assets/svg/Order/Checkout/close-icon.svg';
import WarningIcon from 'assets/svg/Order/Checkout/warning.svg';
import useTimer from 'components/Order/OrderCheckoutPage/hooks/useTimer';
import formatPhoneNumber from 'components/Order/OrderCheckoutPage/utils/formatPhoneNumber';
import BottomModal, {
  BottomModalContent,
  BottomModalFooter,
  BottomModalHeader,
} from 'components/Store/mobile/common/BottomModal';
import Button from 'components/ui/Button';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import showToast from 'utils/ts/showToast';

import sheetStyles from 'components/Order/OrderCheckoutPage/components/CheckoutSheet.module.scss';
import styles from './ContactModal.module.scss';

// KOIN_ORDER_WEBVIEW pages/Payment/components/ContactModal 이전(연락처 변경). 새 번호는 SMS 인증 후에만 반영한다
const MESSAGES = {
  PHONE_INVALID: '올바른 전화번호 양식이 아닙니다. 다시 입력해 주세요.',
  CODE_SENT: '인증번호가 발송되었습니다.',
  CODE_INCORRECT: '인증번호가 일치하지 않습니다. 다시 입력해 주세요.',
  CODE_TIMEOUT: '유효시간이 지났습니다. 인증번호를 재발송 해주세요.',
  CODE_DEFAULT: '인증번호 발송이 안 되시나요?',
  VERIFIED: '번호 인증이 완료되었습니다.',
};

const INQUIRE_FORM =
  'https://docs.google.com/forms/d/e/1FAIpQLSeRGc4IIHrsTqZsDLeX__lZ7A-acuioRbABZZFBDY9eMsMTxQ/viewform';

const SMS_CODE_LENGTH = 6;
const PHONE_NUMBER_LENGTH = 11;
const CODE_EXPIRE_SECONDS = 180;

const formatTime = (seconds: number) => {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');

  return `${m}:${s}`;
};

// KoinError의 code는 number로 선언돼 있지만 이 API들은 문자열 code를 내려 준다
const getErrorCode = (error: unknown) => (isKoinError(error) ? String(error.code) : null);

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className={styles.error}>
      <WarningIcon />
      {message}
    </div>
  );
}

interface ContactFormProps {
  currentContact: string;
  onClose: () => void;
  onSubmit: (contact: string) => void;
}

function ContactForm({ currentContact, onClose, onSubmit }: ContactFormProps) {
  const { mutate: sendSmsVerification, isPending: isSending } = useMutation(orderMutations.sendSmsVerification());
  const { mutate: verifySmsCode, isPending: isVerifying } = useMutation(orderMutations.verifySmsCode());

  const [authCode, setAuthCode] = useState('');
  const [draftPhone, setDraftPhone] = useState('');
  const [codeErrorMessage, setCodeErrorMessage] = useState('');
  const [phoneErrorMessage, setPhoneErrorMessage] = useState('');
  const [isCodeSent, setCodeSent, setCodeNotSent] = useBooleanState(false);
  const [isPhoneChanging, startPhoneChanging, stopPhoneChanging] = useBooleanState(false);

  const { seconds: timer, start: startTimer, reset: resetTimer } = useTimer();

  const isEditing = isPhoneChanging || !currentContact;
  const phone = isEditing ? draftPhone : currentContact;

  const isPhoneValid = phone.length === PHONE_NUMBER_LENGTH;
  const shouldDisableSubmit = !isPhoneValid || authCode.length !== SMS_CODE_LENGTH || timer === 0;

  const resetState = () => {
    setDraftPhone('');
    setAuthCode('');
    setCodeNotSent();
    setCodeErrorMessage('');
    setPhoneErrorMessage('');
    resetTimer();
    if (currentContact) stopPhoneChanging();
    else startPhoneChanging();
  };

  const closeModal = () => {
    resetState();
    onClose();
  };

  const handleClickChange = () => {
    startPhoneChanging();
    setDraftPhone('');
    setCodeNotSent();
    setAuthCode('');
    resetTimer();
    setCodeErrorMessage('');
    setPhoneErrorMessage('');
  };

  const handleClickSend = () => {
    setPhoneErrorMessage('');
    if (!isPhoneValid) {
      setPhoneErrorMessage(MESSAGES.PHONE_INVALID);

      return;
    }

    sendSmsVerification(phone, {
      onSuccess: () => {
        setCodeSent();
        startTimer(CODE_EXPIRE_SECONDS);
        showToast('success', MESSAGES.CODE_SENT);
      },
      onError: (error) => {
        if (getErrorCode(error) === 'INVALID_REQUEST_BODY') {
          setPhoneErrorMessage(MESSAGES.PHONE_INVALID);

          return;
        }
        if (isKoinError(error)) showToast('error', error.message);
      },
    });
  };

  const handleClickSubmit = () => {
    verifySmsCode(
      { phone, code: authCode },
      {
        onSuccess: () => {
          setCodeErrorMessage('');
          onSubmit(phone);
          closeModal();
          showToast('success', MESSAGES.VERIFIED);
        },
        onError: (error) => {
          if (getErrorCode(error) === 'NOT_MATCHED_VERIFICATION_CODE') {
            setCodeErrorMessage(MESSAGES.CODE_INCORRECT);

            return;
          }
          if (isKoinError(error)) showToast('error', error.message);
        },
      },
    );
  };

  let codeHelp = (
    <div className={styles.help}>
      {MESSAGES.CODE_DEFAULT}
      {' '}
      <a href={INQUIRE_FORM} className={styles.help__link}>
        문의하기
      </a>
    </div>
  );
  if (timer === 0) codeHelp = <ErrorMessage message={MESSAGES.CODE_TIMEOUT} />;
  else if (codeErrorMessage) codeHelp = <ErrorMessage message={codeErrorMessage} />;

  return (
    <>
      <div className={styles.field}>
        <input
          type="tel"
          maxLength={13}
          disabled={!isEditing}
          value={formatPhoneNumber(phone)}
          onChange={(e) => setDraftPhone(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="010-1234-5678"
          className={styles.field__input}
        />
        {phoneErrorMessage && <ErrorMessage message={phoneErrorMessage} />}

        {currentContact && !isEditing && (
          <Button color="gray" className={styles.field__action} onClick={handleClickChange}>
            번호 변경
          </Button>
        )}

        {isEditing && (
          <Button
            color="gray"
            disabled={!isPhoneValid || isSending}
            className={cn({
              [styles.field__action]: true,
              [styles['field__action--inactive']]: !isPhoneValid,
            })}
            onClick={handleClickSend}
          >
            {isCodeSent ? '인증번호 재발송' : '인증번호 발송'}
          </Button>
        )}
      </div>

      {isCodeSent && (
        <>
          <div>
            <div className={styles.field}>
              <input
                type="text"
                maxLength={6}
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="6자리를 입력해주세요"
                className={styles.field__input}
              />
              <span className={styles.field__timer}>{formatTime(timer)}</span>
            </div>
            {codeHelp}
          </div>

          <Button
            size="lg"
            onClick={handleClickSubmit}
            className={styles.submit}
            disabled={shouldDisableSubmit || isVerifying}
            state={shouldDisableSubmit ? 'disabled' : 'default'}
          >
            확인
          </Button>
        </>
      )}
    </>
  );
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentContact: string;
  onSubmit: (contact: string) => void;
}

export default function ContactModal({ isOpen, onClose, currentContact, onSubmit }: ContactModalProps) {
  return (
    <BottomModal className={sheetStyles.sheet} isOpen={isOpen} onClose={onClose}>
      <BottomModalHeader className={sheetStyles.sheet__section}>
        <div className={sheetStyles.sheet__title}>연락처</div>
        <button type="button" onClick={onClose}>
          <CloseIcon />
        </button>
      </BottomModalHeader>
      <BottomModalContent className={sheetStyles.sheet__section}>
        <ContactForm key={currentContact} currentContact={currentContact} onClose={onClose} onSubmit={onSubmit} />
      </BottomModalContent>
      <BottomModalFooter className={sheetStyles.sheet__section} />
    </BottomModal>
  );
}
