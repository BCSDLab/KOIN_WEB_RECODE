import useBooleanState from 'utils/hooks/state/useBooleanState';
import { type InputMessage } from 'pages/Auth/SignupPage/components/CustomInput';
import useCountdownTimer from 'pages/Auth/SignupPage/hooks/useCountdownTimer';
import {
  emailExists, verificationEmailSend, verificationEmailVerify, idFindEmail, idExists, idMatchEmail,
} from 'api/auth';
import { MESSAGES } from 'static/auth';
import { isKoinError } from '@bcsdlab/koin';
import ROUTES from 'static/routes';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import showToast from 'utils/ts/showToast';

interface UseEmailVerificationProps {
  email: string;
  onNext?: () => void;
}

function useEmailVerification({ email, onNext }: UseEmailVerificationProps) {
  const navigate = useNavigate();
  const [verificationMessage, setVerificationMessage] = useState<InputMessage | null>(null);
  const [emailMessage, setEmailMessage] = useState<InputMessage | null>(null);
  const [isDisabled, enableButton, disableButton] = useBooleanState(false);
  const [isVerified, enableVerified, disableVerified] = useBooleanState(false);
  const [isCodeVerified, enableCodeVerified, disableCodeVerified] = useBooleanState(false);
  const [isCodeCorrect, setCorrect, setIncorrect] = useBooleanState(false);
  const [idMessage, setIdMessage] = useState<InputMessage | null>(null);

  const [smsSendCount, setSmsSendCount] = useState(0);

  const {
    isRunning: isTimer, secondsLeft: timerValue, start: runTimer, stop: stopTimer,
  } = useCountdownTimer({
    duration: 180,
    onExpire: () => {
      if (!isVerified) setVerificationMessage({ type: 'warning', content: MESSAGES.VERIFICATION.TIMEOUT });
    },
  });

  const resetVerificationState = () => {
    disableButton();
    disableVerified();
    disableCodeVerified();
    setIncorrect();
    stopTimer();
    setEmailMessage(null);
    setVerificationMessage(null);
  };

  const { mutate: sendVerificationEmail } = useMutation({
    mutationFn: verificationEmailSend,
    onSuccess: ({ remaining_count }) => {
      setEmailMessage({ type: 'success', content: MESSAGES.EMAIL.CODE_SENT });
      runTimer();
      setSmsSendCount(remaining_count);
      enableButton();
      setTimeout(() => {
        disableButton();
      }, 3000);
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) setEmailMessage({ type: 'warning', content: MESSAGES.EMAIL.FORMAT });

        if (err.status === 429) setEmailMessage({ type: 'error', content: MESSAGES.VERIFICATION.STOP });
      }
    },
  });

  const { mutate: checkEmailExists } = useMutation({
    mutationFn: emailExists,
    onSuccess: () => {
      sendVerificationEmail({ email });
      // setEmailMessage({ type: 'success', content: MESSAGES.EMAIL.CODE_SENT });
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) setEmailMessage({ type: 'warning', content: MESSAGES.EMAIL.FORMAT });

        if (err.status === 404) setEmailMessage({ type: 'warning', content: MESSAGES.EMAIL.NOT_REGISTERED });
      }
    },
  });

  const { mutate: checkVerificationEmailVerify } = useMutation({
    mutationFn: verificationEmailVerify,
    onSuccess: () => {
      setVerificationMessage({ type: 'success', content: MESSAGES.VERIFICATION.CORRECT });
      enableVerified();
      enableCodeVerified();
      setCorrect();
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) setVerificationMessage({ type: 'warning', content: MESSAGES.VERIFICATION.INCORRECT });

        if (err.status === 404) setVerificationMessage({ type: 'error', content: MESSAGES.VERIFICATION.TIMEOUT });
      }
    },
  });

  const { mutate: findEmail } = useMutation({
    mutationFn: idFindEmail,
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

  const { mutate: checkIdMatchEmail } = useMutation({
    mutationFn: idMatchEmail,
    onSuccess: () => {
      if (onNext) onNext();
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400 || err.status === 404) {
          showToast('error', '아이디와 이메일이 일치하지 않습니다');
        }
      }
      resetVerificationState();
    },
  });

  return {
    emailMessage,
    checkEmailExists,
    checkVerificationEmailVerify,
    findEmail,
    isDisabled,
    disableButton,
    isVerified,
    isCodeVerified,
    smsSendCount,
    isCodeCorrect,
    setIncorrect,
    setEmailMessage,
    setVerificationMessage,
    verificationMessage,
    isTimer,
    timerValue,
    stopTimer,
    idMessage,
    setIdMessage,
    checkIdExists,
    checkIdMatchEmail,
  };
}

export default useEmailVerification;
