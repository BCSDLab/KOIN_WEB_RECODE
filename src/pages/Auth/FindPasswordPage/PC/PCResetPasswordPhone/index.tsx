import { useState } from 'react';
import {
  Controller, useFormContext, useWatch, FieldError,
} from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { isKoinError } from '@bcsdlab/koin';
import ROUTES from 'static/routes';
import { useNavigate } from 'react-router-dom';
import { MESSAGES, REGEX } from 'static/auth';
import { cn } from '@bcsdlab/utils';
import BackIcon from 'assets/svg/arrow-back.svg';
import PCCustomInput, { type InputMessage } from 'pages/Auth/SignupPage/components/PCCustomInput';
import styles from './PCResetPasswordPhone.module.scss';

interface PCResetPasswordPhoneProps {
  onNext: () => void;
  onBack: () => void;
}

interface PasswordResetFormValues {
  loginId: string,
  contactType: string,
  phoneNumber: string,
  verificationCode: string,
  password: string,
  password_check: string,
  newPassword: string,
  newPasswordCheck: string,
}

function PCResetPasswordPhone({ onNext, onBack }: PCResetPasswordPhoneProps) {
  const {
    control, getValues, handleSubmit, trigger,
  } = useFormContext<PasswordResetFormValues>();

  const navigate = useNavigate();
  const newPassword = useWatch({ control, name: 'newPassword' });
  const newPasswordCheck = useWatch({ control, name: 'newPasswordCheck' });

  // const [verificationMessage, setVerificationMessage] = useState<InputMessage | null>(null);
  // const [phoneMessage, setPhoneMessage] = useState<InputMessage | null>(null);
  // const [isCodeCorrect, setIsCodeCorrect] = useState(false);

  const isFormFilled = newPassword && newPasswordCheck;

  const getPasswordCheckMessage = (
    fieldValue: string | undefined,
    fieldError: FieldError | undefined,
  ): InputMessage | undefined => {
    if (!fieldValue) return undefined;
    if (fieldError) {
      return { type: 'warning', content: MESSAGES.PASSWORD.MISMATCH };
    }
    return { type: 'success', content: MESSAGES.PASSWORD.MATCH };
  };

  console.log(getValues());

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
            name="newPassword"
            control={control}
            defaultValue=""
            rules={{
              required: true,
              pattern: {
                value: REGEX.PASSWORD,
                message: MESSAGES.PASSWORD.FORMAT,
              },
            }}
            render={({ field, fieldState }) => (
              <PCCustomInput
                {...field}
                htmlFor="newPassword"
                labelName="비밀번호"
                isRequired
                placeholder="특수문자 포함 영어와 숫자 6~18자리로 입력해주세요."
                type="password"
                onChange={(e) => {
                  field.onChange(e);
                  trigger('password_check');
                }}
                isVisibleButton
                message={fieldState.error ? { type: 'warning', content: MESSAGES.PASSWORD.FORMAT } : null}
              />
            )}
          />
        </div>

        <div className={styles['input-wrapper']}>
          <Controller
            name="newPasswordCheck"
            control={control}
            defaultValue=""
            rules={{
              required: true,
              validate: (value) => value === getValues('newPassword'),
            }}
            render={({ field, fieldState }) => (
              <PCCustomInput
                {...field}
                htmlFor="newPasswordCheck"
                labelName="비밀번호 확인"
                isRequired
                placeholder="비밀번호를 한번 더 입력해 주세요."
                type="password"
                isVisibleButton
                message={getPasswordCheckMessage(field.value, fieldState.error)}
              />
            )}
          />
        </div>
      </div>

      <div className={`${styles.divider} ${styles['divider--bottom']}`} />

      <button
        type="button"
        onClick={onNext}
        className={cn({
          [styles['button-next']]: true,
          [styles['button-next--active']]: Boolean(isFormFilled),
        })}
        disabled={!isFormFilled}
      >
        다음
      </button>
    </div>
  );
}

export default PCResetPasswordPhone;
