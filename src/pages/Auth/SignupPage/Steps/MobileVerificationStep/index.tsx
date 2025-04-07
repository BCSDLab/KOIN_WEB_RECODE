/* eslint-disable no-restricted-imports */
import { useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { checkPhone, smsSend, smsVerify } from 'api/auth';
import { useMutation } from '@tanstack/react-query';
import { isKoinError } from '@bcsdlab/koin';
import useCountdownTimer from '../../hooks/useCountdownTimer';
import CustomInput, { type InputMessage } from '../../components/CustomInput';
import styles from './MobileVerification.module.scss';

const ERROR_MESSAGES = {
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
  const { control, register } = useFormContext();
  const name = useWatch({ control, name: 'name' });
  const gender = useWatch({ control, name: 'gender' });
  const phoneNumber = useWatch({ control, name: 'phoneNumber' });
  const verificationCode = useWatch({ control, name: 'verificationCode' });
  const [showVerificationField, setShowVerificationField] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<InputMessage | null>(null);
  const [phoneMessage, setPhoneMessage] = useState<InputMessage | null>(null);

  const { isRunning: isTimer, secondsLeft: timerValue, start: runTimer } = useCountdownTimer({
    duration: 100,
    onExpire: () => {
      setVerificationMessage({ type: 'error', content: ERROR_MESSAGES.CODE_TIMEOUT });
    },
  });

  const { mutate: sendSMSToUser } = useMutation({
    mutationFn: smsSend,
    onSuccess: () => {
      setPhoneMessage({ type: 'success', content: ERROR_MESSAGES.CODE_SENT });
      runTimer();
      setShowVerificationField(true);
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) {
          setPhoneMessage({ type: 'error', content: ERROR_MESSAGES.CODE_STOP });
        }
      }
    },
  });

  const { mutate: checkVerificationCode } = useMutation({
    mutationFn: smsVerify,
    onSuccess: () => {
      setVerificationMessage({ type: 'success', content: ERROR_MESSAGES.CODE_CORRECT });
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) {
          setVerificationMessage({ type: 'warning', content: ERROR_MESSAGES.CODE_INCORRECT });
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
          setPhoneMessage({ type: 'warning', content: ERROR_MESSAGES.INVALID_PHONE });
        }

        if (err.status === 409) {
          setPhoneMessage({ type: 'error', content: ERROR_MESSAGES.ALREADY_REGISTERED });
        }
      }
    },
  });

  const isNameAndGenderFilled = name?.trim() && gender?.length > 0;

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
          <div>
            {GENDER_OPTIONS.map(({ label, value }) => (
              <label key={value}>
                <input type="checkbox" value={value} {...register('gender')} />
                {label}
              </label>
            ))}
          </div>
        </div>

        {isNameAndGenderFilled && (
        <div className={styles['number-wrapper']}>
          <h1 className={styles['number-wrapper__header']}>휴대전화 번호를 입력해 주세요.</h1>
          <div className={styles['input-wrapper']}>
            <Controller
              name="phoneNumber"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <CustomInput
                  {...field}
                  placeholder="- 없이 번호를 입력해 주세요."
                  isDelete
                  message={phoneMessage}
                />
              )}
            />
            <button
              className={styles['input-wrapper__button']}
              type="button"
              onClick={() => checkPhoneNumber(phoneNumber)}
              disabled={!phoneNumber?.trim()}
            >
              인증번호 발송
            </button>
          </div>

          {showVerificationField && (
          <div className={styles['input-wrapper']}>
            <Controller
              name="verificationCode"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <CustomInput
                  {...field}
                  placeholder="인증번호를 입력해주세요."
                  isDelete
                  isTimer={isTimer}
                  timerValue={timerValue}
                  message={verificationMessage}
                />
              )}
            />
            <button
              className={styles['input-wrapper__button']}
              type="button"
              onClick={() => {
                checkVerificationCode({
                  phone_number: phoneNumber,
                  certification_code: verificationCode,
                });
              }}
            >
              인증번호 확인
            </button>
          </div>
          )}
        </div>
        )}
      </div>

      <button
        type="button"
        onClick={onNext}
        className={styles['next-button']}
      >
        다음
      </button>

    </div>
  );
}

export default MobileVerification;
