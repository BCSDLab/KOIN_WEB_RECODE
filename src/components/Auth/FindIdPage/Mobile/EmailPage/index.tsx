/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import CustomInput from 'components/Auth/SignupPage/components/CustomInput';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import useEmailVerification from 'utils/hooks/auth/useEmailVerification';
import styles from './EmailPage.module.scss';

function MobileFindIdEmailPage() {
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      verification_code: '',
    },
  });

  const { control } = methods;
  const email = useWatch({ control, name: 'email' });
  const verificationCode = useWatch({ control, name: 'verification_code' });
  const isFormFilled = email && verificationCode;

  const {
    emailMessage,
    checkEmailExists,
    checkVerificationEmailVerify,
    findEmail,
    isDisabled,
    disableButton,
    isVerified,
    emailSendCountData,
    isCodeCorrect,
    setIncorrect,
    setEmailMessage,
    verificationMessage,
    isTimer,
    timerValue,
    stopTimer,
  } = useEmailVerification({ email });

  const onClickSendVerificationButton = () => {
    checkVerificationEmailVerify({
      email,
      verification_code: verificationCode,
    });
  };

  const onClickFindIdButton = () => {
    findEmail({
      email,
      verification_code: verificationCode,
    });
  };

  useEffect(() => {
    disableButton();
    stopTimer();
    setEmailMessage(null);
    setIncorrect();
  }, [email]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onClickFindIdButton)} className={styles.container}>
        <div className={styles['form-container']}>
          <div className={styles['name-gender-wrapper']}>
            <h1 className={styles['name-gender-wrapper__header']}>이메일</h1>

            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <CustomInput
                  {...field}
                  placeholder="등록된 이메일을 입력해 주세요."
                  isDelete={!isVerified}
                  message={emailMessage}
                  isButton
                  disabled={isVerified}
                  buttonText="인증번호 발송"
                  buttonDisabled={!field.value || isDisabled || isVerified}
                  buttonOnClick={() => checkEmailExists({ email: field.value })}
                >
                  {emailMessage?.type === 'success' && (
                    <div className={styles['label-count-number']}>
                      남은 횟수 ({emailSendCountData?.remaining_count}/{emailSendCountData?.total_count})
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
                  isDelete={!isVerified}
                  isTimer={isVerified ? false : isTimer}
                  timerValue={timerValue}
                  message={verificationMessage}
                  isButton
                  disabled={isVerified}
                  buttonText="인증번호 확인"
                  buttonDisabled={!field.value || isDisabled || isVerified}
                  buttonOnClick={() => onClickSendVerificationButton()}
                />
              )}
            />
          </div>
        </div>
        <button type="submit" className={styles['next-button']} disabled={!isFormFilled || !isCodeCorrect}>
          다음
        </button>
      </form>
    </FormProvider>
  );
}

export default MobileFindIdEmailPage;
