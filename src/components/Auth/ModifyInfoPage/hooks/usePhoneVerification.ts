import { useEffect, useRef, useState } from 'react';
import { isKoinError } from '@bcsdlab/koin';
import { useMutation } from '@tanstack/react-query';
import { smsSend, smsVerify, checkPhone } from 'api/auth';
import { MESSAGES } from 'static/auth';
import { useVerificationTimer } from './useVerificationTimer';
import type { SmsSendResponse } from 'api/auth/entity';

type VerificationMessageType = 'success' | 'warning' | 'error' | 'default';

interface VerificationMessage {
  type: VerificationMessageType;
  content: string;
}

interface UsePhoneVerificationOptions {
  showVerificationHelp?: boolean;
}

const VERIFICATION_HELP_DELAY = 60000;
const INCORRECT_VERIFICATION_MESSAGE = '인증번호가 일치하지 않습니다.';

export function usePhoneVerification(
  phoneNumber: string,
  { showVerificationHelp = false }: UsePhoneVerificationOptions = {},
) {
  const [isVerified, setIsVerified] = useState(false);
  const [hasSentVerificationCode, setHasSentVerificationCode] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState<VerificationMessage | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<VerificationMessage | null>(null);
  const [smsSendCountData, setSmsSendCountData] = useState<SmsSendResponse | null>(null);
  const verificationHelpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearVerificationHelpTimer = () => {
    if (!verificationHelpTimerRef.current) return;

    clearTimeout(verificationHelpTimerRef.current);
    verificationHelpTimerRef.current = null;
  };

  const { start, stop, reset: resetTimer, expire, formattedTime, timeLeft, isRunning } = useVerificationTimer(
    180,
    () => {
      clearVerificationHelpTimer();
      if (!isVerified) {
        setVerificationMessage({ type: 'warning', content: MESSAGES.VERIFICATION.TIMEOUT });
      }
    },
  );

  const sendSMS = useMutation({
    mutationFn: smsSend,
    onSuccess: (data: SmsSendResponse) => {
      clearVerificationHelpTimer();
      setPhoneMessage({ type: 'success', content: MESSAGES.PHONE.CODE_SENT });
      setVerificationMessage(null);
      setSmsSendCountData(data);
      setHasSentVerificationCode(true);
      setIsVerified(false);
      start();

      if (showVerificationHelp) {
        verificationHelpTimerRef.current = setTimeout(() => {
          setVerificationMessage({ type: 'default', content: MESSAGES.VERIFICATION.DEFAULT });
        }, VERIFICATION_HELP_DELAY);
      }
    },
    onError: (err) => {
      if (isKoinError(err)) {
        const { status } = err;
        if (status === 400) setPhoneMessage({ type: 'warning', content: MESSAGES.PHONE.INVALID });
        if (status === 429) {
          clearVerificationHelpTimer();
          stop();
          setPhoneMessage({ type: 'error', content: MESSAGES.VERIFICATION.STOP });
          setVerificationMessage(null);
        }
      }
    },
  });

  const checkPhoneNumber = useMutation({
    mutationFn: checkPhone,
    onSuccess: () => sendSMS.mutate({ phone_number: phoneNumber }),
    onError: (err) => {
      if (isKoinError(err)) {
        const { status } = err;
        if (status === 400) setPhoneMessage({ type: 'warning', content: MESSAGES.PHONE.INVALID });
        if (status === 409) setPhoneMessage({ type: 'error', content: MESSAGES.PHONE.ALREADY_REGISTERED });
      }
    },
  });

  const verifyCode = useMutation({
    mutationFn: smsVerify,
    onSuccess: () => {
      clearVerificationHelpTimer();
      setVerificationMessage({ type: 'success', content: MESSAGES.VERIFICATION.CORRECT });
      setIsVerified(true);
      stop();
    },
    onError: (err) => {
      if (isKoinError(err)) {
        const { status } = err;
        if (status === 400) {
          setVerificationMessage({ type: 'warning', content: INCORRECT_VERIFICATION_MESSAGE });
        }
        if (status === 404) {
          clearVerificationHelpTimer();
          setVerificationMessage({ type: 'warning', content: MESSAGES.VERIFICATION.TIMEOUT });
          expire();
        }
      }
    },
  });

  const resetVerification = () => {
    clearVerificationHelpTimer();
    stop();
    resetTimer();
    setIsVerified(false);
    setHasSentVerificationCode(false);
    setPhoneMessage(null);
    setVerificationMessage(null);
    setSmsSendCountData(null);
    checkPhoneNumber.reset();
    sendSMS.reset();
    verifyCode.reset();
  };

  useEffect(
    () => () => {
      if (verificationHelpTimerRef.current) {
        clearTimeout(verificationHelpTimerRef.current);
      }
    },
    [],
  );

  const isSendLimitExceeded = phoneMessage?.content === MESSAGES.VERIFICATION.STOP;
  const isSending = checkPhoneNumber.isPending || sendSMS.isPending;

  return {
    checkPhoneNumber,
    verifyCode,
    phoneMessage,
    verificationMessage,
    isVerified,
    hasSentVerificationCode,
    isSendLimitExceeded,
    isSending,
    smsSendCountData,
    sendSMS,
    setPhoneMessage,
    setVerificationMessage,
    resetVerification,
    formattedTime,
    timeLeft,
    isRunning,
  };
}
