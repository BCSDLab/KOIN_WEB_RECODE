/* eslint-disable no-restricted-imports */
import { useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { checkPhone, smsSend, smsVerify } from 'api/auth';
import { useMutation } from '@tanstack/react-query';
import { isKoinError } from '@bcsdlab/koin';
import ROUTES from 'static/routes';
import { useNavigate } from 'react-router-dom';
import type { SmsSendResponse } from 'api/auth/entity';
import useCountdownTimer from '../../hooks/useCountdownTimer';
import CustomInput, { type InputMessage } from '../../components/CustomInput';
import styles from './MobileVerification.module.scss';

const MESSAGES = {
  // 전화번호 입력
  INVALID_PHONE: '올바른 전화번호 양식이  아닙니다. 다시 입력해 주세요.',
  ALREADY_REGISTERED: '이미 가입된 전화 번호입니다.',
  CODE_SENT: '인증번호가 발송되었습니다.',

  // 인증번호 입력
  DEFAULT: '인증번호 발송이 안 되시나요?',
  CODE_TIMEOUT: '유효시간이 지났습니다. 인증번호를 재발송 해주세요.',
  CODE_INCORRECT: '인증번호가 일치하지 않습니다. 다시 입력해 주세요.',
  CODE_CORRECT: '인증번호가 일치합니다.',
  CODE_STOP: '1일 발송 한도를 초과했습니다. 24시간 이후 재시도 바랍니다.',
};

const GENDER_OPTIONS = [
  { label: '남성', value: 'male' },
  { label: '여성', value: 'female' },
];

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
        setVerificationMessage({ type: 'warning', content: MESSAGES.CODE_TIMEOUT });
      }
    },
  });

  const { mutate: sendSMSToUser } = useMutation({
    mutationFn: smsSend,
    onSuccess: (data : SmsSendResponse) => {
      setPhoneMessage({ type: 'success', content: MESSAGES.CODE_SENT });
      runTimer();
      setShowVerificationField(true);
      setSmsSendCount(data.remaining_count);
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) {
          setPhoneMessage({ type: 'warning', content: MESSAGES.INVALID_PHONE });
        }
        if (err.status === 429) {
          setPhoneMessage({ type: 'error', content: MESSAGES.CODE_STOP });
        }
      }
    },
  });

  const { mutate: checkVerificationCode } = useMutation({
    mutationFn: smsVerify,
    onSuccess: () => {
      setVerificationMessage({ type: 'success', content: MESSAGES.CODE_CORRECT });
      setIsCodeCorrect(true);
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) {
          setVerificationMessage({ type: 'warning', content: MESSAGES.CODE_INCORRECT });
        }
        if (err.status === 404) {
          setVerificationMessage({ type: 'error', content: MESSAGES.CODE_TIMEOUT });
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
          setPhoneMessage({ type: 'warning', content: MESSAGES.INVALID_PHONE });
        }

        if (err.status === 409) {
          setPhoneMessage({ type: 'error', content: MESSAGES.ALREADY_REGISTERED });
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
