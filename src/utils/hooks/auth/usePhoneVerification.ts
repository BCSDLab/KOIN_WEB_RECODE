import { isKoinError } from '@bcsdlab/koin';
import { useMutation } from '@tanstack/react-query';
import {
  idFindSms, phoneExists, smsSend, smsVerify,
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

function usePhoneVerification({ phoneNumber }: { phoneNumber: string }) {
  const navigate = useNavigate();
  const [phoneMessage, setPhoneMessage] = useState<InputMessage | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<InputMessage | null>(null);
  const [isDisabled, enableButton, disableButton] = useBooleanState(false);
  const [isVerified, enableVerified] = useBooleanState(false);
  const [isCodeVerified, enableCodeVerified] = useBooleanState(false);
  const [smsSendCount, setSmsSendCount] = useState(0);
  const [isCodeCorrect, setCorrect, setIncorrect] = useBooleanState(false);

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

  const { mutate: sendVerificationSms } = useMutation({
    mutationFn: smsSend,
    onSuccess: ({ remaining_count }) => {
      setPhoneMessage({ type: 'success', content: MESSAGES.PHONE.CODE_SENT });
      runTimer();
      setSmsSendCount(remaining_count);
      enableButton();
      setTimeout(() => {
        disableButton();
      }, 3000);
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) setPhoneMessage({ type: 'warning', content: MESSAGES.PHONE.INVALID });

        if (err.status === 429) { setPhoneMessage({ type: 'error', content: MESSAGES.VERIFICATION.STOP }); }
      }
    },
  });

  const { mutate: checkPhoneExists } = useMutation({
    mutationFn: phoneExists,
    onSuccess: () => {
      sendVerificationSms({ phone_number: phoneNumber });
      setPhoneMessage({ type: 'success', content: MESSAGES.PHONE.CODE_SENT });
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) { setPhoneMessage({ type: 'warning', content: MESSAGES.PHONE.INVALID }); }

        if (err.status === 404) { setPhoneMessage({ type: 'warning', content: MESSAGES.PHONE.NOT_REGISTERED }); }
      }
    },
  });

  const { mutate: checkVerificationSmsVerify } = useMutation({
    mutationFn: smsVerify,
    onSuccess: () => {
      setVerificationMessage({ type: 'success', content: MESSAGES.VERIFICATION.CORRECT });
      enableVerified();
      enableCodeVerified();
      setCorrect();
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) { setVerificationMessage({ type: 'warning', content: MESSAGES.VERIFICATION.INCORRECT }); }

        if (err.status === 404) { setVerificationMessage({ type: 'error', content: MESSAGES.VERIFICATION.TIMEOUT }); }
      }
    },
  });

  const { mutate: findId } = useMutation({
    mutationFn: idFindSms,
    onSuccess: ({ login_id }) => {
      navigate(ROUTES.IDResult());
      navigate(`${ROUTES.IDResult()}?userId=${login_id}`);
    },
  });

  return {
    phoneMessage,
    checkPhoneExists,
    checkVerificationSmsVerify,
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
  };
}

export default usePhoneVerification;
