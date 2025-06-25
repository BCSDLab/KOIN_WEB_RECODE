import { isKoinError } from '@bcsdlab/koin';
import { useMutation } from '@tanstack/react-query';
import {
  checkPhone,
  idExists,
  idFindSms, idMatchPhone, phoneExists, smsSend, smsVerify,
} from 'api/auth';
import { useNavigate } from 'react-router-dom';
import { MESSAGES } from 'static/auth';
import { useState } from 'react';
import {
  type InputMessage,
} from 'pages/Auth/SignupPage/components/CustomInput';
import ROUTES from 'static/routes';
import useCountdownTimer from 'pages/Auth/SignupPage/hooks/useCountdownTimer';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import showToast from 'utils/ts/showToast';
import { useFormContext } from 'react-hook-form';
import { SmsSendResponse } from 'api/auth/entity';

interface UsePhoneVerificationProps {
  phoneNumber: string;
  onNext?: () => void;
}

function usePhoneVerification({ phoneNumber, onNext }: UsePhoneVerificationProps) {
  const navigate = useNavigate();
  const { setValue } = useFormContext();
  const [phoneMessage, setPhoneMessage] = useState<InputMessage | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<InputMessage | null>(null);
  const [isDisabled, enableButton, disableButton] = useBooleanState(false);
  const [isVerified, enableVerified, disableVerified] = useBooleanState(false);
  const [isCodeVerified, enableCodeVerified, disableCodeVerified] = useBooleanState(false);
  const [smsSendCount, setSmsSendCount] = useState(0);
  const [isCodeCorrect, setCorrect, setIncorrect] = useBooleanState(false);
  const [idMessage, setIdMessage] = useState<InputMessage | null>(null);

  const {
    isRunning: isTimer,
    secondsLeft: timerValue,
    start: runTimer,
    stop: stopTimer,
  } = useCountdownTimer({
    duration: 180,
    onExpire: () => {
      if (!isVerified) {
        setVerificationMessage({
          type: 'warning',
          content: MESSAGES.VERIFICATION.TIMEOUT,
        });
      }
    },
  });

  const resetVerificationState = () => {
    disableButton();
    disableVerified();
    disableCodeVerified();
    setIncorrect();
    stopTimer();
    setPhoneMessage(null);
    setVerificationMessage(null);
  };

  const {
    mutate: sendVerificationSms,
    isPending: isSendingVerification,
  } = useMutation({
    mutationFn: smsSend,
    onSuccess: ({ remaining_count }) => {
      setPhoneMessage({ type: 'success', content: MESSAGES.PHONE.CODE_SENT });
      setValue('phoneMessage', { type: 'success', content: MESSAGES.PHONE.CODE_SENT });
      runTimer();
      setSmsSendCount(remaining_count);
      enableButton();
      setValue('isDisabled', true);
      setTimeout(() => {
        disableButton();
        setValue('isDisabled', false);
      }, 3000);
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) {
          setPhoneMessage({ type: 'warning', content: MESSAGES.PHONE.INVALID });
          setValue('phoneMessage', { type: 'warning', content: MESSAGES.PHONE.INVALID });
        }

        if (err.status === 429) {
          setPhoneMessage({ type: 'error', content: MESSAGES.VERIFICATION.STOP });
          setValue('phoneMessage', { type: 'error', content: MESSAGES.VERIFICATION.STOP });
        }
      }
    },
  });

  const { mutate: checkPhoneExists } = useMutation({
    mutationFn: phoneExists, // 아이디, 비밀번호 찾기 때 사용되는 api
    onSuccess: () => {
      sendVerificationSms({ phone_number: phoneNumber });
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) {
          setPhoneMessage({ type: 'warning', content: MESSAGES.PHONE.INVALID });
          setValue('phoneMessage', { type: 'warning', content: MESSAGES.PHONE.INVALID });
        }

        if (err.status === 404) {
          setPhoneMessage({ type: 'warning', content: MESSAGES.PHONE.NOT_REGISTERED });
          setValue('phoneMessage', { type: 'warning', content: MESSAGES.PHONE.NOT_REGISTERED });
        }
      }
    },
  });

  const { mutate: checkVerificationSmsVerify } = useMutation({
    mutationFn: smsVerify,
    onSuccess: () => {
      setVerificationMessage({ type: 'success', content: MESSAGES.VERIFICATION.CORRECT });
      setValue('verificationMessage', { type: 'success', content: MESSAGES.VERIFICATION.CORRECT });
      setValue('isCorrect', true);
      setValue('isDisabled', true);
      enableVerified();
      enableCodeVerified();
      setCorrect();
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) setVerificationMessage({ type: 'warning', content: MESSAGES.VERIFICATION.INCORRECT });

        if (err.status === 404) setVerificationMessage({ type: 'error', content: MESSAGES.VERIFICATION.TIMEOUT });
      }
      setValue('isCorrect', false);
    },
  });

  const { mutate: sendSMSToUser } = useMutation({
    mutationFn: smsSend,
    onSuccess: (data: SmsSendResponse) => {
      setPhoneMessage({ type: 'success', content: MESSAGES.PHONE.CODE_SENT });
      setValue('phoneMessage', { type: 'success', content: MESSAGES.PHONE.CODE_SENT });
      runTimer();
      setSmsSendCount(data.remaining_count);

      setSmsSendCount(data.remaining_count);
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) {
          setPhoneMessage({ type: 'warning', content: MESSAGES.PHONE.INVALID });
          setValue('phoneMessage', { type: 'warning', content: MESSAGES.PHONE.INVALID });
        }
        if (err.status === 429) {
          setPhoneMessage({ type: 'error', content: MESSAGES.VERIFICATION.STOP });
          setValue('phoneMessage', { type: 'error', content: MESSAGES.VERIFICATION.STOP });
        }
      }
    },
  });

  const { mutate: checkPhoneNumber } = useMutation({
    mutationFn: checkPhone, // 회원가입 할 때 사용되는 api
    onSuccess: () => {
      sendSMSToUser({ phone_number: phoneNumber });
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) {
          setPhoneMessage({ type: 'warning', content: MESSAGES.PHONE.INVALID });
          setValue('phoneMessage', { type: 'warning', content: MESSAGES.PHONE.INVALID });
        }

        if (err.status === 409) {
          setPhoneMessage({ type: 'error', content: MESSAGES.PHONE.ALREADY_REGISTERED, code: 'ALREADY_REGISTERED' });
          setValue('phoneMessage', { type: 'error', content: MESSAGES.PHONE.ALREADY_REGISTERED, code: 'ALREADY_REGISTERED' });
        }
      }
    },
  });

  const { mutate: findId } = useMutation({
    mutationFn: idFindSms,
    onSuccess: ({ login_id }) => {
      navigate(`${ROUTES.IDResult()}?userId=${login_id}`);
    },
  });

  const { mutate: checkIdExists } = useMutation({
    mutationFn: idExists,
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) setIdMessage({ type: 'warning', content: MESSAGES.ID.FORMAT });

        if (err.status === 404) setIdMessage({ type: 'warning', content: MESSAGES.ID.NOT_REGISTERED });
      }
    },
  });

  const { mutate: checkIdMatchPhone } = useMutation({
    mutationFn: idMatchPhone,
    onSuccess: () => {
      if (onNext) onNext();
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400 || err.status === 404) {
          showToast('error', '아이디와 휴대폰 번호가 일치하지 않습니다');
        }
      }
      resetVerificationState();
    },
  });

  return {
    phoneMessage,
    checkPhoneExists,
    checkVerificationSmsVerify,
    isSendingVerification,
    findId,
    isDisabled,
    disableButton,
    isVerified,
    isCodeVerified,
    smsSendCount,
    isCodeCorrect,
    setIncorrect,
    setPhoneMessage,
    setVerificationMessage,
    verificationMessage,
    isTimer,
    timerValue,
    stopTimer,
    checkIdExists,
    checkIdMatchPhone,
    idMessage,
    setIdMessage,
    checkPhoneNumber,
  };
}

export default usePhoneVerification;
