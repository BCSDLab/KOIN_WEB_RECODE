import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { isKoinError } from '@bcsdlab/koin';
import CustomInput from 'pages/Auth/SignupPage/components/CustomInput';
import { ContactType, MESSAGES } from 'static/auth';
import useEmailVerification from 'utils/hooks/auth/useEmailVerification';
import styles from './MobileVerifyEmail.module.scss';

interface MobileFindPasswordProps {
  onNext: () => void;
  setContactType: (type: ContactType) => void;
}

function MobileVerifyEmail({ onNext, setContactType }: MobileFindPasswordProps) {
  const { control, setValue } = useFormContext();

  const loginId = useWatch({ control, name: 'loginId' });
  const email = useWatch({ control, name: 'email' });
  const verificationCode = useWatch({ control, name: 'verificationCode' });

  const {
    emailMessage,
    checkEmailExists,
    checkVerificationEmailVerify,
    isDisabled,
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
    checkIdExists,
    checkIdMatchEmail,
    idMessage,
    setIdMessage,
  } = useEmailVerification({ email, onNext });

  const onClickSendVerificationButton = () => {
    checkVerificationEmailVerify({ email, verification_code: verificationCode });
  };

  const handleNext = () => {
    checkIdExists({
      login_id: loginId,
    }, {
      onSuccess: () => {
        // 아이디가 존재할 경우, 아이디-이메일 일치 여부 확인
        setContactType('EMAIL');
        checkIdMatchEmail({
          login_id: loginId,
          email,
        });
      },
      onError: (err) => {
        if (isKoinError(err)) {
          if (err.status === 404) {
            setIdMessage({ type: 'warning', content: MESSAGES.EMAIL.NOT_REGISTERED });
          } else if (err.status === 400) {
            setIdMessage({ type: 'warning', content: MESSAGES.EMAIL.FORMAT });
          }
        }
      },
    });
  };

  const isFormFilled = loginId && email && verificationCode && isCodeCorrect;

  return (
    <div className={styles.container}>
      <div className={styles['form-container']}>
        <div className={styles['id-wrapper']}>
          <h1 className={styles['id-wrapper__header']}>아이디</h1>
          <Controller
            name="loginId"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <CustomInput
                {...field}
                placeholder="아이디를 입력해 주세요."
                isDelete
                message={idMessage}
              />
            )}
          />
        </div>

        <div className={styles['verify-wrapper']}>
          <h1 className={styles['verify-wrapper__header']}>
            이메일
          </h1>

          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className={styles['input-wrapper']}>
                <CustomInput
                  {...field}
                  placeholder="이메일을 입력해 주세요."
                  isDelete={!isVerified}
                  message={emailMessage}
                  isButton
                  disabled={isVerified}
                  buttonText="인증번호 발송"
                  buttonDisabled={!field.value || isDisabled || isVerified}
                  onChange={(e) => {
                    field.onChange(e);
                    setEmailMessage(null);
                    stopTimer();
                    setIncorrect();
                    setVerificationMessage(null);
                    setValue('email', '');
                  }}
                  buttonOnClick={() => {
                    checkEmailExists({ email });
                  }}
                >
                  {emailMessage?.type === 'success' && (
                    <div className={styles['label-count-number']}>
                      남은 횟수 (
                      {smsSendCount}
                      /5)
                    </div>
                  )}
                </CustomInput>
              </div>
            )}
          />
        </div>

        <div className={styles['verify-wrapper']}>
          <h1 className={styles['verify-wrapper__header']}>인증 번호</h1>
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
                buttonDisabled={!field.value || isCodeVerified}
                buttonOnClick={() => onClickSendVerificationButton()}
              />
            )}
          />
        </div>
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

export default MobileVerifyEmail;
