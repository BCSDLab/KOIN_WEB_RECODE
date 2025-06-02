/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import {
  Controller, FormProvider, useForm, useWatch,
} from 'react-hook-form';

import { MESSAGES } from 'static/auth';
import { useNavigate } from 'react-router-dom';
import ROUTES from 'static/routes';
import usePhoneVerification from 'utils/hooks/auth/usePhoneVerification';
import CustomInput from 'pages/Auth/SignupPage/components/CustomInput';
import styles from './MobileFindIdPhonePage.module.scss';

function MobileFindIdPhonePage() {
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
    smsSendCount,
    isCodeCorrect,
    // setIncorrect,
    setPhoneMessage,
    setVerificationMessage,
    verificationMessage,
    isTimer,
    timerValue,
    stopTimer,
  } = usePhoneVerification({ phoneNumber });

  const isFormFilled = phoneNumber && verificationCode;

  const onClickSendVerificationButton = () => {
    checkVerificationSmsVerify({ phone_number: phoneNumber, verification_code: verificationCode });
  };

  const onClickFindIdButton = () => {
    findId({ phone_number: phoneNumber, verification_code: verificationCode });
  };

  useEffect(() => {
    stopTimer();
    // setIncorrect();
    disableButton();
    setPhoneMessage(null);
    setVerificationMessage({ type: 'default', content: MESSAGES.PHONE.REGISTRATION });
  }, [phoneNumber]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onClickFindIdButton)}
        className={styles.container}
      >
        <div className={styles['form-container']}>
          <div className={styles['name-gender-wrapper']}>
            <h1 className={styles['name-gender-wrapper__header']}>
              휴대전화 번호
            </h1>

            <Controller
              name="phone_number"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <CustomInput
                  {...field}
                  placeholder="- 없이 번호를 입력해 주세요."
                  isDelete={!isVerified}
                  message={phoneMessage}
                  isButton
                  disabled={isVerified}
                  buttonText="인증번호 발송"
                  buttonDisabled={!field.value || isDisabled || isVerified}
                  buttonOnClick={() => checkPhoneExists({ phone_number: phoneNumber })}
                >
                  {phoneMessage?.type === 'success' && (
                    <div className={styles['label-count-number']}>
                      남은 횟수 (
                      {smsSendCount}
                      /5)
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
                    <button
                      className={styles['label-link-button']}
                      type="button"
                      onClick={() => navigate(ROUTES.Email())}
                    >
                      이메일로 찾기
                    </button>
                  )}
                </CustomInput>
              )}
            />
          </div>
        </div>
        <button
          type="submit"
          className={styles['next-button']}
          disabled={!isFormFilled || !isCodeCorrect}
        >
          다음
        </button>
      </form>
    </FormProvider>
  );
}

export default MobileFindIdPhonePage;
