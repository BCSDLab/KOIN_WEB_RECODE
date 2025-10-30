import { useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { isKoinError } from '@bcsdlab/koin';
import usePhoneVerification from 'utils/hooks/auth/usePhoneVerification';
import CustomInput from 'components/Auth/SignupPage/components/CustomInput';
import { ContactType, MESSAGES } from 'static/auth';
import styles from './MobileVerifyPhone.module.scss';

interface MobileFindPasswordProps {
  onNext: () => void;
  goToEmailStep: () => void;
  setContactType: (type: ContactType) => void;
}

function MobileVerifyPhone({ onNext, goToEmailStep, setContactType }: MobileFindPasswordProps) {
  const { control, setValue } = useFormContext();

  const loginId = useWatch({ control, name: 'loginId' });
  const phoneNumber = useWatch({ control, name: 'phoneNumber' });
  const verificationCode = useWatch({ control, name: 'verificationCode' });

  const [isVerificationSent, setIsVerificationSent] = useState(false);

  const {
    phoneMessage,
    checkPhoneExists,
    checkVerificationSmsVerify,
    isDisabled,
    isVerified,
    isCodeVerified,
    smsSendCountData,
    isCodeCorrect,
    setIncorrect,
    setPhoneMessage,
    setVerificationMessage,
    verificationMessage,
    isTimer,
    timerValue,
    stopTimer,
    checkIdExists,
    checkIdMatchPhone,
    setIdMessage,
  } = usePhoneVerification({ phoneNumber, onNext });

  const onClickSendVerificationButton = () => {
    checkVerificationSmsVerify({ phone_number: phoneNumber, verification_code: verificationCode });
  };

  const handleNext = () => {
    checkIdExists(
      {
        login_id: loginId,
      },
      {
        onSuccess: () => {
          // 아이디가 존재할 경우, 아이디-휴대폰 일치 여부 확인
          setContactType('PHONE');
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
      },
    );
  };

  const isFormFilled = loginId && phoneNumber && verificationCode;

  return (
    <div className={styles.container}>
      <div className={styles['form-container']}>
        <div className={styles['id-wrapper']}>
          <h1 className={styles['id-wrapper__header']}>아이디</h1>
          <Controller
            name="loginId"
            control={control}
            defaultValue=""
            render={({ field }) => <CustomInput {...field} placeholder="아이디를 입력해 주세요." isDelete />}
          />
        </div>

        <div className={styles['verify-wrapper']}>
          <h1 className={styles['verify-wrapper__header']}>휴대전화 번호</h1>

          <Controller
            name="phoneNumber"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className={styles['input-wrapper']}>
                <CustomInput
                  {...field}
                  placeholder="- 없이 번호를 입력해 주세요."
                  maxLength={11}
                  isDelete={!isVerified}
                  message={phoneMessage}
                  isButton
                  disabled={isVerified}
                  buttonText="인증번호 발송"
                  buttonDisabled={!field.value || isDisabled || isVerified}
                  onChange={(e) => {
                    field.onChange(e);
                    setPhoneMessage(null);
                    stopTimer();
                    setIncorrect();
                    setVerificationMessage(null);
                    setValue('verificationCode', '');
                  }}
                  buttonOnClick={() => {
                    checkPhoneExists({ phone_number: phoneNumber });
                    setIsVerificationSent(true);
                  }}
                >
                  {phoneMessage?.type === 'success' && (
                    <div className={styles['label-count-number']}>
                      남은 횟수 ({smsSendCountData?.remaining_count}/{smsSendCountData?.total_count})
                    </div>
                  )}
                </CustomInput>
                {!isVerificationSent && (
                  <div className={styles['email-navigate']}>
                    <div className={styles['email-navigate__text']}>휴대전화 등록을 안 하셨나요?</div>
                    <button type="button" className={styles['email-navigate__link']} onClick={goToEmailStep}>
                      이메일로 찾기
                    </button>
                  </div>
                )}
              </div>
            )}
          />
        </div>

        {isVerificationSent && (
          <div className={styles['verify-check-wrapper']}>
            <h1 className={styles['verify-check-wrapper__header']}>인증 번호</h1>
            <Controller
              name="verificationCode"
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
                    <button className={styles['label-link-button']} type="button" onClick={goToEmailStep}>
                      이메일로 찾기
                    </button>
                  )}
                </CustomInput>
              )}
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className={styles['next-button']}
        onClick={handleNext}
        disabled={!isFormFilled || !isCodeCorrect}
      >
        다음
      </button>
    </div>
  );
}

export default MobileVerifyPhone;
