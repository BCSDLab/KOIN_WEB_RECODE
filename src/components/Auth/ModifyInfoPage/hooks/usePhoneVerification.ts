import { useState } from 'react';
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

const INCORRECT_VERIFICATION_MESSAGE = '인증번호가 일치하지 않습니다.';
const VERIFICATION_DURATION_SECONDS = 180;
const VERIFICATION_HELP_DELAY_SECONDS = 60;

export function usePhoneVerification(
  normalizedPhoneNumber: string,
  { showVerificationHelp = false }: UsePhoneVerificationOptions = {},
) {
  const [isVerified, setIsVerified] = useState(false);
  const [hasSentVerificationCode, setHasSentVerificationCode] = useState(false);
  const [isSendLimitExceeded, setIsSendLimitExceeded] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState<VerificationMessage | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<VerificationMessage | null>(null);
  const [smsSendCountData, setSmsSendCountData] = useState<SmsSendResponse | null>(null);

  const { start, stop, reset: resetTimer, expire, formattedTime, timeLeft, isRunning } = useVerificationTimer(
    VERIFICATION_DURATION_SECONDS,
    () => {
      if (!isVerified) {
        setVerificationMessage({ type: 'warning', content: MESSAGES.VERIFICATION.TIMEOUT });
      }
    },
  );

  const sendSMS = useMutation({
    mutationFn: smsSend,
    onSuccess: (data: SmsSendResponse) => {
      setIsSendLimitExceeded(false);
      setPhoneMessage({ type: 'success', content: MESSAGES.PHONE.CODE_SENT });
      setVerificationMessage(null);
      setSmsSendCountData(data);
      setHasSentVerificationCode(true);
      setIsVerified(false);
      start();
    },
    onError: (err) => {
      if (isKoinError(err)) {
        const { status } = err;
        if (status === 400) setPhoneMessage({ type: 'warning', content: MESSAGES.PHONE.INVALID });
        if (status === 429) {
          stop();
          setIsSendLimitExceeded(true);
          setPhoneMessage({ type: 'error', content: MESSAGES.VERIFICATION.STOP });
          setVerificationMessage(null);
        }
      }
    },
  });

  const checkPhoneNumber = useMutation({
    mutationFn: checkPhone,
    onSuccess: (_, checkedPhoneNumber) => {
      if (checkedPhoneNumber !== normalizedPhoneNumber) return;
      sendSMS.mutate({ phone_number: checkedPhoneNumber });
    },
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
          setVerificationMessage({ type: 'warning', content: MESSAGES.VERIFICATION.TIMEOUT });
          expire();
        }
      }
    },
  });

  const resetVerification = () => {
    stop();
    resetTimer();
    setIsVerified(false);
    setHasSentVerificationCode(false);
    setIsSendLimitExceeded(false);
    setPhoneMessage(null);
    setVerificationMessage(null);
    setSmsSendCountData(null);
  };

  const isSending = checkPhoneNumber.isPending || sendSMS.isPending;
  const shouldShowVerificationHelp =
    showVerificationHelp &&
    hasSentVerificationCode &&
    isRunning &&
    timeLeft <= VERIFICATION_DURATION_SECONDS - VERIFICATION_HELP_DELAY_SECONDS;
  const displayedVerificationMessage: VerificationMessage | null =
    verificationMessage ??
    (shouldShowVerificationHelp ? { type: 'default', content: MESSAGES.VERIFICATION.DEFAULT } : null);

  return {
    checkPhoneNumber,
    verifyCode,
    phoneMessage,
    verificationMessage: displayedVerificationMessage,
    isVerified,
    hasSentVerificationCode,
    isSendLimitExceeded,
    isSending,
    smsSendCountData,
    resetVerification,
    formattedTime,
    timeLeft,
    isRunning,
  };
}
