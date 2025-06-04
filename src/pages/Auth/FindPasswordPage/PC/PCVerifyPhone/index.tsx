import { isKoinError } from '@bcsdlab/koin';
import { cn } from '@bcsdlab/utils';
import BackIcon from 'assets/svg/arrow-back.svg';
import PCCustomInput from 'pages/Auth/SignupPage/components/PCCustomInput';
import { useState } from 'react';
import {
  Controller, useFormContext, useWatch,
} from 'react-hook-form';
import { MESSAGES } from 'static/auth';
import usePhoneVerification from 'utils/hooks/auth/usePhoneVerification';
import styles from './PCVerifyPhone.module.scss';

interface FindPasswordProps {
  onNext: () => void;
  onBack: () => void;
  goToEmailStep: () => void;
}

function PCVerifyPhone({ onNext, onBack, goToEmailStep }: FindPasswordProps) {
  const { control, getValues } = useFormContext();

  const loginId = useWatch({ control, name: 'loginId' });

  console.log(getValues());

  const phoneNumber = useWatch({ control, name: 'phoneNumber' });
  const verificationCode = useWatch({ control, name: 'verificationCode' });

  const [buttonText, setButtonText] = useState('인증번호 발송');

  const {
    phoneMessage,
    checkPhoneExists,
    checkVerificationSmsVerify,
    isDisabled,
    // disableButton,
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
    // stopTimer,
    checkIdExists,
    checkIdMatchPhone,
    idMessage,
    setIdMessage,
  } = usePhoneVerification({ phoneNumber, loginId, onNext });

  const onClickSendVerificationButton = () => {
    checkVerificationSmsVerify({ phone_number: phoneNumber, verification_code: verificationCode });
  };

  const handleNext = () => {
    checkIdExists({
      login_id: loginId,
    }, {
      onSuccess: () => {
        // 아이디가 존재할 경우, 아이디-휴대폰 일치 여부 확인
        checkIdMatchPhone({
          login_id: loginId,
          phone_number: phoneNumber,
        });
      },
      onError: (err) => {
        if (isKoinError(err)) {
          if (err.status === 404) {
            setIdMessage({ type: 'warning', content: MESSAGES.ID.NOT_REGISTERED });
          } else if (err.status === 400) {
            setIdMessage({ type: 'warning', content: MESSAGES.ID.FORMAT });
          }
        }
      },
    });
  };

  const isFormFilled = loginId && phoneNumber && verificationCode && isCodeCorrect;

  return (
    <div className={styles.container}>

      <div className={styles.container__wrapper}>
        <div className={styles['container__title-wrapper']}>
          <button
            type="button"
            onClick={onBack}
            aria-label="뒤로가기"
            className={styles['container__back-button']}
          >
            <BackIcon />
          </button>
          <h1 className={styles.container__title}>비밀번호 찾기</h1>
        </div>
      </div>

      <div className={`${styles.divider} ${styles['divider--top']}`} />

      <div className={styles['form-container']}>

        <div className={styles['input-wrapper']}>
          <Controller
            name="loginId"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <PCCustomInput
                {...field}
                htmlFor="loginId"
                labelName="아이디"
                placeholder="아이디를 입력해 주세요."
                isDelete
                isRequired
                message={idMessage}
              />
            )}
          />
        </div>

        <div className={styles['input-wrapper']}>
          <Controller
            name="phoneNumber"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className={styles['input-with-button']}>
                <PCCustomInput
                  htmlFor="phoneNumber"
                  labelName="휴대전화"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setPhoneMessage(null);
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
                  {phoneMessage?.type === 'default' && (
                    <button
                      type="button"
                      className={styles.findByEmailLink}
                      onClick={goToEmailStep}
                    >
                      이메일로 찾기
                    </button>
                  )}
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
                  onClick={() => checkPhoneExists({ phone_number: phoneNumber })}
                  className={styles['check-button']}
                  disabled={!field.value || isDisabled || isVerified}
                >
                  {buttonText}
                </button>
              </div>
            )}
          />
        </div>

        <div className={styles['input-wrapper']}>
          <Controller
            name="verificationCode"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className={styles['input-with-button']}>
                <PCCustomInput
                  {...field}
                  htmlFor="verificationCode"
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

      <button
        type="button"
        onClick={handleNext}
        className={cn({
          [styles['button-next']]: true,
          [styles['button-next--active']]: isFormFilled,
        })}
        disabled={!isFormFilled}
      >
        다음
      </button>
    </div>
  );
}

export default PCVerifyPhone;
