/* eslint-disable react-hooks/exhaustive-deps */
import BackIcon from 'assets/svg/arrow-back.svg';
import PCCustomInput from 'pages/Auth/SignupPage/components/PCCustomInput';
import { useEffect } from 'react';
import {
  Controller, FormProvider, useForm, useWatch,
} from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { MESSAGES } from 'static/auth';
import ROUTES from 'static/routes';
import usePhoneVerificationInFindId from 'utils/hooks/auth/usePhoneVerificationInFindId';
import styles from './FindIdPhonePage.module.scss';

function FindIdPhonePage() {
  const navigate = useNavigate();

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      verification_code: '',
      phone_number: '',
    },
  });

  const { control } = methods;
  const phoneNumber = useWatch({ control, name: 'phone_number' });
  const verificationCode = useWatch({ control, name: 'verification_code' });

  const {
    phoneMessage,
    checkPhoneExists,
    checkVerificationSmsVerify,
    findId,
    isDisabled,
    disableButton,
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
  } = usePhoneVerificationInFindId({ phoneNumber });

  const isFormFilled = phoneNumber && verificationCode;

  const onClickSendVerificationButton = () => {
    checkVerificationSmsVerify({ phone_number: phoneNumber, verification_code: verificationCode });
  };

  const onClickFindIdButton = () => {
    findId({ phone_number: phoneNumber, verification_code: verificationCode });
  };

  useEffect(() => {
    stopTimer();
    setIncorrect();
    disableButton();
    setPhoneMessage(null);
    setVerificationMessage({ type: 'default', content: MESSAGES.PHONE.REGISTRATION });
  }, [phoneNumber]);

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
                name="phone_number"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <div className={styles['input-with-button']}>
                    <PCCustomInput
                      {...field}
                      isRequired
                      labelName="휴대전화"
                      htmlFor="phone_number"
                      placeholder="- 없이 번호를 입력해 주세요."
                      message={phoneMessage}
                      disabled={isVerified}
                      isDelete={!isVerified}
                    >
                      {phoneMessage?.type === 'success' && (
                      <div className={styles['label-count-number']}>
                        {' '}
                        남은 횟수 (
                        {smsSendCountData?.remaining_count}
                        /
                        {smsSendCountData?.total_count}
                        )
                      </div>
                      )}
                    </PCCustomInput>
                    <button
                      type="button"
                      onClick={() => checkPhoneExists({ phone_number: phoneNumber })}
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
                      isRequired
                      labelName="휴대전화 인증"
                      htmlFor="verification_code"
                      placeholder="인증번호를 입력해 주세요."
                      message={verificationMessage}
                      disabled={isCodeVerified}
                      isTimer={isCodeCorrect ? false : isTimer}
                      timerValue={timerValue}
                      isDelete={!isVerified}
                    >
                      {verificationMessage?.type === 'default' && (
                      <button
                        className={styles['label-link-button']}
                        type="button"
                        onClick={() => navigate(ROUTES.Email())}
                      >
                        이메일로 찾기
                      </button>
                      )}
                    </PCCustomInput>
                    <button
                      type="button"
                      onClick={() => onClickSendVerificationButton()}
                      className={styles['check-button']}
                      disabled={isCodeVerified}
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

export default FindIdPhonePage;
