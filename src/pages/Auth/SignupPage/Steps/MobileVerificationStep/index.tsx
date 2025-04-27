/* eslint-disable no-restricted-imports */
import { useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { checkPhone, smsSend, smsVerify } from 'api/auth';
import { useMutation } from '@tanstack/react-query';
import { isKoinError } from '@bcsdlab/koin';
import ROUTES from 'static/routes';
import { useNavigate } from 'react-router-dom';
import type { SmsSendResponse } from 'api/auth/entity';
import { GENDER_OPTIONS, MESSAGES } from 'static/auth';
import useCountdownTimer from '../../hooks/useCountdownTimer';
import CustomInput, { type InputMessage } from '../../components/CustomInput';
import styles from './MobileVerification.module.scss';

interface MobileVerificationProps {
  onNext: () => void;
}

function MobileVerification({ onNext }: MobileVerificationProps) {
  const navigate = useNavigate();
  const { control, register } = useFormContext();
  const name = useWatch({ control, name: 'name' });
  const gender = useWatch({ control, name: 'gender' });
  const phoneNumber = useWatch({ control, name: 'phone_number' });
  const verificationCode = useWatch({ control, name: 'verification_code' });

  const [showVerificationField, setShowVerificationField] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<InputMessage | null>(null);
  const [phoneMessage, setPhoneMessage] = useState<InputMessage | null>(null);
  const [isCodeCorrect, setIsCodeCorrect] = useState(false);
  const [smsSendCount, setSmsSendCount] = useState(0);

  const { isRunning: isTimer, secondsLeft: timerValue, start: runTimer } = useCountdownTimer({
    duration: 200,
    onExpire: () => {
      if (!isCodeCorrect) {
        setVerificationMessage({ type: 'warning', content: MESSAGES.VERIFICATION.TIMEOUT });
      }
    },
  });

  const { mutate: sendSMSToUser } = useMutation({
    mutationFn: smsSend,
    onSuccess: (data : SmsSendResponse) => {
      setPhoneMessage({ type: 'success', content: MESSAGES.PHONE.CODE_SENT });
      runTimer();
      setShowVerificationField(true);
      setSmsSendCount(data.remaining_count);
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) {
          setPhoneMessage({ type: 'warning', content: MESSAGES.PHONE.INVALID });
        }
        if (err.status === 429) {
          setPhoneMessage({ type: 'error', content: MESSAGES.VERIFICATION.STOP });
        }
      }
    },
  });

  const { mutate: checkVerificationCode } = useMutation({
    mutationFn: smsVerify,
    onSuccess: () => {
      setVerificationMessage({ type: 'success', content: MESSAGES.VERIFICATION.CORRECT });
      setIsCodeCorrect(true);
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) {
          setVerificationMessage({ type: 'warning', content: MESSAGES.VERIFICATION.INCORRECT });
        }
        if (err.status === 404) {
          setVerificationMessage({ type: 'error', content: MESSAGES.VERIFICATION.TIMEOUT });
        }
      }
    },
  });

  const { mutate: checkPhoneNumber } = useMutation({
    mutationFn: checkPhone,
    onSuccess: () => {
      sendSMSToUser({ phone_number: phoneNumber });
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) {
          setPhoneMessage({ type: 'warning', content: MESSAGES.PHONE.INVALID });
        }

        if (err.status === 409) {
          setPhoneMessage({ type: 'error', content: MESSAGES.PHONE.ALREADY_REGISTERED });
        }
      }
    },
  });

  const isNameAndGenderFilled = name?.trim() && gender?.length > 0;
  const isFormFilled = name && gender && phoneNumber && verificationCode;

  const goToLogin = () => {
    navigate(ROUTES.Auth());
  };

  return (
    <div className={styles.container}>
      <div className={styles['form-container']}>
        <div className={styles['name-gender-wrapper']}>
          <h1 className={styles['name-gender-wrapper__header']}>성함과 성별을 알려주세요.</h1>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <CustomInput {...field} placeholder="실명을 입력해 주세요." isDelete />
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
                  isDelete
                  message={phoneMessage}
                  isButton
                  buttonText="인증번호 발송"
                  buttonDisabled={!field.value}
                  buttonOnClick={() => checkPhoneNumber(phoneNumber)}
                >
                  {phoneMessage?.type === 'success' && (
                    <div className={styles['label-count-number']}>
                      {' '}
                      남은 횟수 (
                      {smsSendCount}
                      /5)
                    </div>
                  )}
                  {
                    phoneMessage?.type === 'error' && (
                    <button onClick={() => goToLogin()} type="button" className={styles['label-link-button']}>
                      로그인하기
                    </button>
                    )
                  }
                </CustomInput>
              )}
            />
          </div>

          {showVerificationField && (
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
                  isTimer={isCodeCorrect ? false : isTimer}
                  timerValue={timerValue}
                  message={verificationMessage}
                  isButton
                  buttonText="인증번호 확인"
                  buttonDisabled={!field.value}
                  buttonOnClick={() => {
                    checkVerificationCode({
                      phone_number: phoneNumber,
                      verification_code: verificationCode,
                    });
                  }}
                />
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
        disabled={!isFormFilled}
      >
        다음
      </button>

    </div>
  );
}

export default MobileVerification;
