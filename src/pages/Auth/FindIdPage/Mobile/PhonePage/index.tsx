/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import {
  Controller, FormProvider, useForm, useWatch,
} from 'react-hook-form';
import CustomInput, { type InputMessage } from 'pages/Auth/SignupPage/components/CustomInput';
import { useMutation } from '@tanstack/react-query';
import {
  phoneExists, smsSend, smsVerify, idFindSms,
} from 'api/auth';
import { MESSAGES } from 'static/auth';
import { isKoinError } from '@bcsdlab/koin';
import useCountdownTimer from 'pages/Auth/SignupPage/hooks/useCountdownTimer';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'static/routes';
import styles from './MobileFindIdPhonePage.module.scss';

function MobileFindIdPhonePage() {
  const [verificationMessage, setVerificationMessage] = useState<InputMessage | null>(null);
  const [phoneMessage, setPhoneMessage] = useState<InputMessage | null>(null);
  const [isDisabled, enableButton, disableButton] = useBooleanState(false);
  const [isVerified, enableVerified] = useBooleanState(false);
  const [isCodeVerified, enableCodeVerified] = useBooleanState(false);
  const [smsSendCount, setSmsSendCount] = useState(0);
  const [isCodeCorrect, setCorrect, setIncorrect] = useBooleanState(false);
  const navigate = useNavigate();

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      verification_code: '',
      phone_number: '',
    },
  });

  const { control } = methods;
  const phoneNumber = useWatch({ control, name: 'phone_number' });
  const verificationCode = useWatch({ control, name: 'verification_code' });

  const {
    isRunning: isTimer, secondsLeft: timerValue, start: runTimer, stop: stopTimer,
  } = useCountdownTimer({
    duration: 180,
    onExpire: () => {
      if (!isVerified) setVerificationMessage({ type: 'warning', content: MESSAGES.VERIFICATION.TIMEOUT });
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

  const onClickSendVerificationButton = () => {
    checkVerificationSmsVerify({
      phone_number: phoneNumber,
      verification_code: verificationCode,
    });
  };

  const onClickFindIdButton = () => {
    findId({
      phone_number: phoneNumber,
      verification_code: verificationCode,
    });
  };

  const isFormFilled = phoneNumber && verificationCode;

  useEffect(() => {
    disableButton();
    stopTimer();
    setVerificationMessage({ type: 'default', content: MESSAGES.PHONE.REGISTRATION });
    setPhoneMessage(null);
    setIncorrect();
  }, [phoneNumber]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onClickFindIdButton)} className={styles.container}>
        <div className={styles['form-container']}>
          <div className={styles['name-gender-wrapper']}>
            <h1 className={styles['name-gender-wrapper__header']}>휴대전화 번호</h1>

            <Controller
              name="phone_number"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <CustomInput
                  {...field}
                  placeholder="- 없이 번호를 입력해 주세요."
                  isDelete={!isVerified}
                  message={phoneMessage}
                  isButton
                  disabled={isVerified}
                  buttonText="인증번호 발송"
                  buttonDisabled={!field.value || isDisabled || isVerified}
                  buttonOnClick={() => checkPhoneExists({ phone_number: phoneNumber })}
                >
                  {phoneMessage?.type === 'success' && (
                    <div className={styles['label-count-number']}>
                      남은 횟수 (
                      {smsSendCount}
                      /5)
                    </div>
                  )}
                </CustomInput>
              )}
            />
          </div>

          <div className={styles['name-gender-wrapper']}>
            <h1 className={styles['name-gender-wrapper__header']}>인증 번호</h1>

            <Controller
              name="verification_code"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <CustomInput
                  {...field}
                  placeholder="인증번호를 입력해주세요."
                  isDelete={!isCodeVerified}
                  isTimer={isVerified ? false : isTimer}
                  timerValue={timerValue}
                  message={verificationMessage}
                  isButton
                  disabled={isCodeVerified}
                  buttonText="인증번호 확인"
                  buttonDisabled={!field.value || isDisabled || isCodeVerified}
                  buttonOnClick={() => onClickSendVerificationButton()}
                >
                  {verificationMessage?.type === 'default' && (
                    <button
                      className={styles['label-link-button']}
                      type="button"
                      onClick={() => navigate(ROUTES.Email())}
                    >
                      이메일로 찾기
                    </button>
                  )}
                </CustomInput>
              )}
            />
          </div>
        </div>
        <button
          type="submit"
          className={styles['next-button']}
          disabled={!isFormFilled || !isCodeCorrect}
        >
          다음
        </button>
      </form>
    </FormProvider>

  );
}

export default MobileFindIdPhonePage;
