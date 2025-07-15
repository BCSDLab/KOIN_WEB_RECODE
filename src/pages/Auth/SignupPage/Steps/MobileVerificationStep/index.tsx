/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-imports */
import { useEffect, useState } from 'react';
import {
  Controller, useFormContext, useFormState, useWatch,
} from 'react-hook-form';
import { checkPhone, smsSend, smsVerify } from 'api/auth';
import { useMutation } from '@tanstack/react-query';
import { isKoinError } from '@bcsdlab/koin';
import { GENDER_OPTIONS, MESSAGES, REGEX } from 'static/auth';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import ROUTES from 'static/routes';
import type { SmsSendResponse } from 'api/auth/entity';
import useLogger from 'utils/hooks/analytics/useLogger';
import useCountdownTimer from '../../hooks/useCountdownTimer';
import styles from './MobileVerification.module.scss';
import CustomInput, { type InputMessage } from '../../components/CustomInput';

interface MobileVerificationProps {
  onNext: () => void;
}

export const validateName = (value: string) => {
  if (/^[가-힣]+$/.test(value)) {
    return REGEX.NAME_KR.test(value) ? true : MESSAGES.NAME.FORMAT_KR;
  }

  if (/^[a-zA-Z\s]+$/.test(value)) {
    return REGEX.NAME_EN.test(value) ? true : MESSAGES.NAME.FORMAT_EN;
  }

  return MESSAGES.NAME.INVALID;
};

interface SmsSendCountData {
  total_count: number;
  remaining_count: number;
  current_count: number;
}

function MobileVerification({ onNext }: MobileVerificationProps) {
  const logger = useLogger();
  const { control, register } = useFormContext();
  const { isValid } = useFormState({ control });
  const name = useWatch({ control, name: 'name' });
  const gender = useWatch({ control, name: 'gender' });
  const phoneNumber = useWatch({ control, name: 'phone_number' });
  const verificationCode = useWatch({ control, name: 'verification_code' });

  const [verificationMessage, setVerificationMessage] = useState<InputMessage | null>(null);
  const [phoneMessage, setPhoneMessage] = useState<InputMessage | null>(null);
  const [isDisabled, enableButton, disableButton] = useBooleanState(false);
  const [isVerificationShown, showVerification] = useBooleanState(false);
  const [isVerified, enableVerified] = useBooleanState(false);
  const [isCodeCorrect, setCorrect, setIncorrect] = useBooleanState(false);
  const [smsSendCountData, setSmsSendCountData] = useState<SmsSendCountData | null>(null);

  const {
    isRunning: isTimer, secondsLeft: timerValue, start: runTimer, stop: stopTimer,
  } = useCountdownTimer({
    duration: 180,
    onExpire: () => {
      if (!isVerified) setVerificationMessage({ type: 'warning', content: MESSAGES.VERIFICATION.TIMEOUT });
    },
  });

  const { mutate: sendSMSToUser } = useMutation({
    mutationFn: smsSend,
    onSuccess: (data : SmsSendResponse) => {
      setPhoneMessage({ type: 'success', content: MESSAGES.PHONE.CODE_SENT });
      runTimer();
      showVerification();
      setSmsSendCountData({
        total_count: data.total_count,
        remaining_count: data.remaining_count,
        current_count: data.current_count,
      });
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

  const { mutate: checkVerificationCode } = useMutation({
    mutationFn: smsVerify,
    onSuccess: () => {
      setVerificationMessage({ type: 'success', content: MESSAGES.VERIFICATION.CORRECT });
      enableVerified();
      setCorrect();
      logger.actionEventClick({
        team: 'USER',
        event_label: 'identity_verification',
        value: '인증완료',
        custom_session_id: '도훈',
      });
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) { setVerificationMessage({ type: 'warning', content: MESSAGES.VERIFICATION.INCORRECT }); }

        if (err.status === 404) { setVerificationMessage({ type: 'error', content: MESSAGES.VERIFICATION.TIMEOUT }); }
      }
    },
  });

  const { mutate: checkPhoneNumber } = useMutation({
    mutationFn: checkPhone,
    onSuccess: () => {
      sendSMSToUser({ phone_number: phoneNumber });
      logger.actionEventClick({
        team: 'USER',
        event_label: 'identity_verification',
        value: '인증번호 발송',
        custom_session_id: '도훈',
      });
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) { setPhoneMessage({ type: 'warning', content: MESSAGES.PHONE.INVALID }); }

        if (err.status === 409) { setPhoneMessage({ type: 'error', content: MESSAGES.PHONE.ALREADY_REGISTERED }); }
      }
    },
  });

  const onClickSendVerificationButton = () => {
    checkVerificationCode({
      phone_number: phoneNumber,
      verification_code: verificationCode,
    });
  };

  const isNameAndGenderFilled = name?.trim() && gender?.length > 0;

  useEffect(() => {
    disableButton();
    stopTimer();
    setVerificationMessage(null);
    setPhoneMessage(null);
    setIncorrect();
  }, [phoneNumber]);

  useEffect(() => {
    if (timerValue === 120) {
      setVerificationMessage({ type: 'default', content: MESSAGES.VERIFICATION.DEFAULT });
    }
  }, [timerValue]);

  return (
    <div className={styles.container}>
      <div className={styles['form-container']}>
        <div className={styles['name-gender-wrapper']}>
          <h1 className={styles['name-gender-wrapper__header']}>성함과 성별을 알려주세요.</h1>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{
              required: MESSAGES.NAME.REQUIRED,
              validate: validateName,
            }}
            render={({ field, fieldState }) => (
              <CustomInput
                {...field}
                placeholder="성함을 입력해 주세요."
                isDelete
                message={
                  fieldState.error?.message
                    ? { type: 'warning', content: fieldState.error.message }
                    : null
                }
              />
            )}
          />
          <div className={styles['checkbox-wrapper']}>
            {GENDER_OPTIONS.map(({ label, value }) => (
              <label key={value} className={styles['checkbox-wrapper__checkbox']}>
                <input type="radio" value={value} {...register('gender')} />
                <div>{label}</div>
              </label>
            ))}
          </div>
        </div>

        {isNameAndGenderFilled && (
        <div className={styles['number-wrapper']}>
          <h1 className={styles['number-wrapper__header']}>휴대전화 번호를 입력해 주세요.</h1>
          <div className={styles['input-wrapper']}>
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
                  buttonOnClick={() => checkPhoneNumber(phoneNumber)}
                  maxLength={11}
                >
                  {phoneMessage?.type === 'success' && (
                    <div className={styles['label-count-number']}>
                      {' '}
                      남은 횟수 (
                      {smsSendCountData?.remaining_count}
                      /
                      {smsSendCountData?.total_count}
                      )
                    </div>
                  )}
                  {
                    phoneMessage?.type === 'error' && phoneMessage?.content === '이미 가입된 전화 번호입니다.' && (
                      <a href={ROUTES.Auth()} className={styles['label-link-button']}>로그인하기</a>
                    )
                  }
                </CustomInput>
              )}
            />
          </div>
          {phoneMessage?.type === 'error' && phoneMessage?.content === '이미 가입된 전화 번호입니다.' && (
            <div className={styles['input__error-message']}>
              해당 전화번호로 가입하신 적 없으신가요?
              <a href={ROUTES.Inquiry()} target="_blank" rel="noopener noreferrer" className={styles['label-link-button']}>문의하기</a>
            </div>
          )}

          {isVerificationShown && (
          <div className={styles['input-wrapper']}>
            <Controller
              name="verification_code"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <CustomInput
                  {...field}
                  placeholder="인증번호를 입력해주세요."
                  isDelete
                  isTimer={isVerified ? false : isTimer}
                  timerValue={timerValue}
                  message={verificationMessage}
                  isButton
                  buttonText="인증번호 확인"
                  buttonDisabled={!field.value}
                  buttonOnClick={() => onClickSendVerificationButton()}
                >
                  {verificationMessage?.type === 'default' && (
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLSeRGc4IIHrsTqZsDLeX__lZ7A-acuioRbABZZFBDY9eMsMTxQ/viewform"
                      className={styles['label-link-button']}
                      target="_blank"
                      rel="noreferrer"
                    >
                      문의하기
                    </a>
                  )}
                </CustomInput>
              )}
            />
          </div>
          )}
        </div>
        )}
      </div>

      <button
        type="button"
        onClick={onNext}
        className={styles['next-button']}
        disabled={!isValid || !isCodeCorrect}
      >
        다음
      </button>

    </div>
  );
}

export default MobileVerification;
