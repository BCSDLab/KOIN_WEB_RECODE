/* eslint-disable no-restricted-imports */
import { useState } from 'react';
import {
  Controller, useFormContext, useFormState, useWatch,
} from 'react-hook-form';
import { UserType, GENDER_OPTIONS } from 'static/auth';
import { cn } from '@bcsdlab/utils';
import BackIcon from 'assets/svg/arrow-back.svg';
import usePhoneVerification from 'utils/hooks/auth/usePhoneVerification';
import PCCustomInput from '../../components/PCCustomInput';
import styles from './VerificationStep.module.scss';

interface VerificationProps {
  onNext: () => void;
  onBack: () => void;
  setUserType: (type: UserType) => void;
}

function Verification({ onNext, onBack, setUserType }: VerificationProps) {
  const { control, register, setValue } = useFormContext();
  const name = useWatch({ control, name: 'name' });
  const gender = useWatch({ control, name: 'gender' });
  const phoneNumber = useWatch({ control, name: 'phone_number' });
  const verificationCode = useWatch({ control, name: 'verification_code' });
  const { errors } = useFormState({ control });

  const [buttonText, setButtonText] = useState('인증번호 발송');

  const {
    phoneMessage,
    checkVerificationSmsVerify,
    isDisabled,
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
    checkPhoneNumber,
  } = usePhoneVerification({ phoneNumber, onNext });

  const onClickSendVerificationButton = () => {
    checkVerificationSmsVerify({ phone_number: phoneNumber, verification_code: verificationCode });
  };

  const isFormFilled = name && !errors.name
  && gender
  && phoneNumber
  && verificationCode
  && isCodeCorrect;

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
                  return (value.length >= 2 && value.length <= 5)
                    ? true
                    : '한글 이름은 2~5자여야 합니다.';
                }

                if (/^[a-zA-Z\s]+$/.test(value)) {
                  return (value.length >= 2 && value.length <= 30)
                    ? true
                    : '영문 이름은 2~30자여야 합니다.';
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
              <div>
                <div className={styles['input-with-button']}>
                  <PCCustomInput
                    htmlFor="phone_number"
                    labelName="휴대전화"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setPhoneMessage(null);
                      stopTimer();
                      setIncorrect();
                      setVerificationMessage(null);
                      setValue('verification_code', '');
                    }}
                    placeholder="숫자만 입력해 주세요."
                    isRequired
                    message={phoneMessage}
                    disabled={isVerified}
                    isDelete={!isVerified}
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
                  </PCCustomInput>
                  <button
                    type="button"
                    onClick={() => {
                      checkPhoneNumber(phoneNumber);
                      setButtonText('인증번호 재발송');
                    }}
                    className={styles['check-button']}
                    disabled={!field.value || isDisabled || isVerified}
                  >
                    {buttonText}
                  </button>
                </div>
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
                  htmlFor="verification_code"
                  labelName="휴대전화 인증"
                  onChange={(e) => {
                    field.onChange(e);
                    setVerificationMessage(null);
                  }}
                  placeholder="인증번호를 입력해주세요."
                  isRequired
                  maxLength={6}
                  isTimer={isCodeCorrect ? false : isTimer}
                  timerValue={timerValue}
                  message={verificationMessage}
                  disabled={isCodeVerified}
                  isDelete={!isVerified}
                  onClear={() => {
                    setVerificationMessage(null);
                    setIncorrect();
                  }}
                />
                <button
                  type="button"
                  onClick={() => onClickSendVerificationButton()}
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
