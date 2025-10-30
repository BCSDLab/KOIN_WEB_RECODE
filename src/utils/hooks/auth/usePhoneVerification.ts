import { isKoinError } from '@bcsdlab/koin';
import { useMutation } from '@tanstack/react-query';
import { checkPhone, idExists, idFindSms, idMatchPhone, phoneExists, smsSend, smsVerify } from 'api/auth';
import { MESSAGES } from 'static/auth';
import { useState } from 'react';
import { type InputMessage } from 'components/Auth/SignupPage/components/CustomInput';
import ROUTES from 'static/routes';
import useCountdownTimer from 'components/Auth/SignupPage/hooks/useCountdownTimer';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import showToast from 'utils/ts/showToast';
import { useFormContext } from 'react-hook-form';
import { SmsSendResponse } from 'api/auth/entity';
import { useSessionLogger } from 'utils/hooks/analytics/useSessionLogger';
import { useRouter } from 'next/router';

interface UsePhoneVerificationProps {
  phoneNumber: string;
  onNext?: () => void;
  step?: 'signup' | 'findId' | 'findPassword';
}

interface SmsSendCountData {
  total_count: number;
  remaining_count: number;
  current_count: number;
}

function usePhoneVerification({ phoneNumber, onNext, step }: UsePhoneVerificationProps) {
  const sessionLogger = useSessionLogger();
  const router = useRouter();
  const { setValue } = useFormContext();
  const [phoneMessage, setPhoneMessage] = useState<InputMessage | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<InputMessage | null>(null);
  const [isDisabled, enableButton, disableButton] = useBooleanState(false);
  const [isVerified, enableVerified, disableVerified] = useBooleanState(false);
  const [isCodeVerified, enableCodeVerified, disableCodeVerified] = useBooleanState(false);
  const [smsSendCountData, setSmsSendCountData] = useState<SmsSendCountData | null>(null);
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
        setValue('verificationMessage', { type: 'warning', content: MESSAGES.VERIFICATION.TIMEOUT });
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

  const { mutate: sendVerificationSms, isPending: isSendingVerification } = useMutation({
    mutationFn: smsSend,
    onSuccess: ({ total_count, remaining_count, current_count }) => {
      setPhoneMessage({ type: 'success', content: MESSAGES.PHONE.CODE_SENT });
      setValue('phoneMessage', { type: 'success', content: MESSAGES.PHONE.CODE_SENT });
      runTimer();
      setSmsSendCountData({ total_count, remaining_count, current_count });
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
    mutationFn: phoneExists,
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
      if (step === 'signup') {
        sessionLogger.actionSessionEvent({
          event_label: 'identity_verification',
          value: '인증완료',
          event_category: 'click',
          session_name: 'sign_up',
        });
      }
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) {
          setVerificationMessage({ type: 'warning', content: MESSAGES.VERIFICATION.INCORRECT });
          setValue('verificationMessage', { type: 'warning', content: MESSAGES.VERIFICATION.INCORRECT });
        }

        if (err.status === 404) {
          setVerificationMessage({ type: 'error', content: MESSAGES.VERIFICATION.TIMEOUT });
          setValue('verificationMessage', { type: 'error', content: MESSAGES.VERIFICATION.TIMEOUT });
        }
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
      setSmsSendCountData({
        remaining_count: data.remaining_count,
        total_count: data.total_count,
        current_count: data.current_count,
      });
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
          setValue('phoneMessage', {
            type: 'error',
            content: MESSAGES.PHONE.ALREADY_REGISTERED,
            code: 'ALREADY_REGISTERED',
          });
        }
      }
    },
  });

  const { mutate: findId } = useMutation({
    mutationFn: idFindSms,
    onSuccess: ({ login_id }) => {
      router.push(`${ROUTES.IDResult()}?userId=${login_id}`);
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
    smsSendCountData,
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
