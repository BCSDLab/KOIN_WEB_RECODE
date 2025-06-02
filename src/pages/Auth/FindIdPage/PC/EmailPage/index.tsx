/* eslint-disable react-hooks/exhaustive-deps */
import BackIcon from 'assets/svg/arrow-back.svg';
import PCCustomInput from 'pages/Auth/SignupPage/components/PCCustomInput';
import { useEffect } from 'react';
import {
  Controller, FormProvider, useForm, useWatch,
} from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'static/routes';
import useEmailVerification from 'utils/hooks/auth/useEmailVerification';
import styles from './FindIdEmailPage.module.scss';

function FindIdEmailPage() {
  const navigate = useNavigate();

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
    isCodeVerified,
    smsSendCount,
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

  const onBack = () => {
    navigate(ROUTES.Auth());
  };

  return (
    <div className={styles.container}>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onClickFindIdButton)}
          className={styles['container__form-wrapper']}
        >
          <div className={styles['container__title-wrapper']}>
            <button type="button" onClick={onBack} aria-label="뒤로가기">
              <BackIcon />
            </button>
            <h1 className={styles['container__title-wrapper--title']}>아이디 찾기</h1>
          </div>
          <div className={`${styles.divider} ${styles['divider--top']}`} />
          <div className={styles['input-container']}>
            <div className={styles['input-wrapper']}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <div className={styles['input-with-button']}>
                    <PCCustomInput
                      {...field}
                      isRequired
                      labelName="이메일"
                      htmlFor="email"
                      placeholder="등록된 이메일을 입력해 주세요."
                      message={emailMessage}
                      disabled={isVerified}
                      isDelete={!isVerified}
                    >
                      {emailMessage?.type === 'success' && (
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
                      onClick={() => checkEmailExists({ email })}
                      className={styles['check-button']}
                      disabled={!field.value || isDisabled || isVerified}
                    >
                      인증번호 발송
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
                      placeholder="인증번호를 입력해 주세요."
                      isDelete={!isCodeVerified}
                      isTimer={isVerified ? false : isTimer}
                      timerValue={timerValue}
                      message={verificationMessage}
                      isRequired
                      labelName="이메일 인증"
                      htmlFor="verification_code"
                      disabled={isCodeVerified}
                    />
                    <button
                      type="button"
                      onClick={() => onClickSendVerificationButton()}
                      className={styles['check-button']}
                      disabled={!field.value || isDisabled || isCodeVerified}
                    >
                      인증번호 확인
                    </button>
                  </div>
                )}
              />
            </div>
          </div>
          <div className={`${styles.divider} ${styles['divider--bottom']}`} />
          <div className={styles['button-container']}>
            <button
              type="submit"
              disabled={!isFormFilled || !isCodeCorrect}
              className={styles['next-button']}
            >
              다음
            </button>
          </div>

        </form>
      </FormProvider>
    </div>
  );
}

export default FindIdEmailPage;
