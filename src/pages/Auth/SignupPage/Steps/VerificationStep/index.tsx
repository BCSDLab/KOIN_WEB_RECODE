/* eslint-disable no-restricted-imports */
import { useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { checkPhone, smsSend, smsVerify } from 'api/auth';
import { useMutation } from '@tanstack/react-query';
import { isKoinError } from '@bcsdlab/koin';
import ROUTES from 'static/routes';
import { useNavigate } from 'react-router-dom';
import type { SmsSendResponse } from 'api/auth/entity';
import { UserType, GENDER_OPTIONS, MESSAGES } from 'static/auth';
import { cn } from '@bcsdlab/utils';
import BackIcon from 'assets/svg/arrow-back.svg';
import useCountdownTimer from '../../hooks/useCountdownTimer';
import styles from './VerificationStep.module.scss';
import PCCustomInput, { type InputMessage } from '../../components/PCCustomInput';

interface VerificationProps {
  onNext: () => void;
  onBack: () => void;
  setUserType: (type: UserType) => void;
}

function Verification({ onNext, onBack, setUserType }: VerificationProps) {
  const navigate = useNavigate();
  const { control, register } = useFormContext();
  const name = useWatch({ control, name: 'name' });
  const gender = useWatch({ control, name: 'gender' });
  const phoneNumber = useWatch({ control, name: 'phone_number' });
  const verificationCode = useWatch({ control, name: 'verification_code' });

  const [, setShowVerificationField] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<InputMessage | null>(null);
  const [phoneMessage, setPhoneMessage] = useState<InputMessage | null>(null);
  const [isCodeCorrect, setIsCodeCorrect] = useState(false);
  const [smsSendCount, setSmsSendCount] = useState(0);
  const [buttonText, setButtonText] = useState('인증번호 발송');

  const { isRunning: isTimer, secondsLeft: timerValue, start: runTimer } = useCountdownTimer({
    duration: 180,
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

      setSmsSendCount(data.remaining_count);

      if (data.remaining_count < 5) {
        setButtonText('인증번호 재발송');
      } else {
        setButtonText('인증번호 발송');
      }
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
      setIsCodeCorrect(false);
      sendSMSToUser({ phone_number: phoneNumber });
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) {
          setPhoneMessage({ type: 'warning', content: MESSAGES.PHONE.INVALID });
        }

        if (err.status === 409) {
          setPhoneMessage({ type: 'error', content: MESSAGES.PHONE.ALREADY_REGISTERED, code: 'ALREADY_REGISTERED' });
        }
      }
    },
  });

  const isFormFilled = name && gender && phoneNumber && verificationCode && isCodeCorrect;

  const goToLogin = () => {
    navigate(ROUTES.Auth());
  };

  const handleStudentClick = () => {
    setUserType('학생');
    onNext();
  };

  const handleExternalClick = () => {
    setUserType('외부인');
    onNext();
  };

  return (
    <div className={styles.container}>

      <div className={styles.container__wrapper}>
        <div className={styles['container__title-wrapper']}>
          <button type="button" onClick={onBack} aria-label="뒤로가기">
            <BackIcon />
          </button>
          <h1 className={styles['container__title-wrapper--title']}>회원가입</h1>
          <div className={styles['container__title-wrapper--icon']}>
            <BackIcon />
          </div>
        </div>
        <div className={styles.container__subTitleWrapper}>
          <span className={styles['container__subTitleWrapper-subTitle']}>
            <span className={styles.required}>*</span>
            필수 입력사항
          </span>
        </div>
        <div className={`${styles.divider} ${styles['divider--top']}`} />
      </div>

      <div className={styles['form-container']}>
        <div className={styles['input-wrapper']}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{
              required: '이름은 필수 항목입니다.',
              validate: (value) => {
                if (/^[가-힣]+$/.test(value)) {
                  return (value.length >= 2 && value.length <= 5) || '한글 이름은 2~5자여야 합니다.';
                }

                if (/^[a-zA-Z\s]+$/.test(value)) {
                  return (value.length >= 2 && value.length <= 30) || '영문 이름은 2~30자여야 합니다.';
                }

                return '한글 또는 영문만 입력 가능합니다.';
              },
            }}
            render={({ field, fieldState }) => (
              <PCCustomInput
                {...field}
                htmlFor="name"
                labelName="이름"
                placeholder="이름을 입력해 주세요."
                isDelete
                isRequired
                message={
                  fieldState.error?.message
                    ? { type: 'warning', content: fieldState.error.message }
                    : null
                }
              />
            )}
          />
        </div>

        <div className={styles['gender-wrapper']}>
          <label
            htmlFor="gender"
            className={styles.wrapper__label}
          >
            성별
            <span className={styles.required}>*</span>
          </label>

          <div className={styles['checkbox-wrapper']}>
            {GENDER_OPTIONS.map(({ label, value }) => (
              <label key={value} className={styles['checkbox-wrapper__checkbox']}>
                <input type="radio" value={value} {...register('gender')} />
                <div>{label}</div>
              </label>
            ))}
          </div>
        </div>

        <div className={styles['input-wrapper']}>
          <Controller
            name="phone_number"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className={styles['input-with-button']}>
                <PCCustomInput
                  htmlFor="gender"
                  labelName="휴대전화"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setPhoneMessage(null);
                    setIsCodeCorrect(false);
                  }}
                  placeholder="숫자만 입력해 주세요."
                  isRequired
                  isDelete
                  message={phoneMessage}
                  onClear={() => {
                    setPhoneMessage(null);
                    setButtonText('인증번호 발송');
                  }}
                >
                  {phoneMessage?.type === 'success' && (
                  <div className={styles['label-count-number']}>
                    {' '}
                    남은 횟수 (
                    {smsSendCount}
                    /5)
                  </div>
                  )}
                  {phoneMessage?.type === 'error' && phoneMessage.code === 'ALREADY_REGISTERED' && (
                  <>
                    <button
                      onClick={goToLogin}
                      type="button"
                      className={styles['label-link-button']}
                    >
                      로그인하기
                    </button>
                    <span className={styles['label-link-split']}>|</span>
                    <a
                      href="https://open.kakao.com/o/sgiYx4Qg"
                      className={styles['label-link-wrapper__button']}
                    >
                      문의하기
                    </a>
                  </>
                  )}
                </PCCustomInput>
                <button
                  type="button"
                  onClick={() => checkPhoneNumber(phoneNumber)}
                  className={styles['check-button']}
                  disabled={!/^01[016789][0-9]{7,8}$/.test(field.value)}
                >
                  {buttonText}
                </button>
              </div>
            )}
          />
        </div>

        <div className={styles['input-wrapper']}>
          <Controller
            name="verification_code"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className={styles['input-with-button']}>
                <PCCustomInput
                  {...field}
                  htmlFor="gender"
                  labelName="휴대전화 인증"
                  onChange={(e) => {
                    field.onChange(e);
                    setVerificationMessage(null);
                  }}
                  placeholder="인증번호를 입력해주세요."
                  isRequired
                  maxLength={6}
                  isDelete
                  isTimer={isCodeCorrect ? false : isTimer}
                  timerValue={timerValue}
                  message={verificationMessage}
                  onClear={() => {
                    setVerificationMessage(null);
                    setIsCodeCorrect(false);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    checkVerificationCode({
                      phone_number: phoneNumber,
                      verification_code: verificationCode,
                    });
                  }}
                  className={styles['check-button']}
                  disabled={!field.value || isCodeCorrect}
                >
                  인증번호 확인
                </button>
              </div>
            )}
          />
        </div>
      </div>

      <div className={`${styles.divider} ${styles['divider--bottom']}`} />

      <div className={styles['button-wrapper']}>
        <button
          type="button"
          onClick={handleStudentClick}
          className={cn({
            [styles['button-wrapper__next-button-student']]: true,
            [styles['button-wrapper__next-button-student--active']]: isFormFilled,
          })}
          disabled={!isFormFilled}
        >
          한국기술교육대학교 학생
        </button>

        <button
          type="button"
          onClick={handleExternalClick}
          className={cn({
            [styles['button-wrapper__next-button-external']]: true,
            [styles['button-wrapper__next-button-external--active']]: isFormFilled,
          })}
          disabled={!isFormFilled}
        >
          기타/외부인
        </button>
      </div>

    </div>
  );
}

export default Verification;
