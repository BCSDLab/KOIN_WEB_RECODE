import { useState } from 'react';
import { isKoinError } from '@bcsdlab/koin';
import { useMutation } from '@tanstack/react-query';
import { smsSend, smsVerify, checkPhone } from 'api/auth';
import { MESSAGES } from 'static/auth';
import { useVerificationTimer } from './useVerificationTimer';

export function usePhoneVerification(phoneNumber: string) {
  const [isVerified, setIsVerified] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState<{ type: string; content: string } | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<{ type: string; content: string } | null>(null);

  const { start, stop, formattedTime, timeLeft, isRunning } = useVerificationTimer(180);

  const sendSMS = useMutation({
    mutationFn: smsSend,
    onSuccess: () => {
      setPhoneMessage({ type: 'success', content: MESSAGES.PHONE.CODE_SENT });
      start();
    },
    onError: (err) => {
      if (isKoinError(err)) {
        const { status } = err;
        if (status === 400) setPhoneMessage({ type: 'warning', content: MESSAGES.PHONE.INVALID });
        if (status === 429) setPhoneMessage({ type: 'error', content: MESSAGES.VERIFICATION.STOP });
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
      setVerificationMessage({ type: 'success', content: MESSAGES.VERIFICATION.CORRECT });
      setIsVerified(true);
      stop();
    },
    onError: (err) => {
      if (isKoinError(err)) {
        const { status } = err;
        if (status === 400) setVerificationMessage({ type: 'warning', content: MESSAGES.VERIFICATION.INCORRECT });
        if (status === 404) setVerificationMessage({ type: 'error', content: MESSAGES.VERIFICATION.TIMEOUT });
      }
    },
  });

  return {
    checkPhoneNumber,
    verifyCode,
    phoneMessage,
    verificationMessage,
    isVerified,
    sendSMS,
    setPhoneMessage,
    setVerificationMessage,
    formattedTime,
    timeLeft,
    isRunning,
  };
}
