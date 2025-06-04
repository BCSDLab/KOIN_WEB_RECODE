import {
  Controller, useFormContext, useWatch, FieldError,
} from 'react-hook-form';
import { MESSAGES, REGEX } from 'static/auth';
import { cn } from '@bcsdlab/utils';
import BackIcon from 'assets/svg/arrow-back.svg';
import PCCustomInput, { type InputMessage } from 'pages/Auth/SignupPage/components/PCCustomInput';
import { isKoinError } from '@bcsdlab/koin';
import showToast from 'utils/ts/showToast';
import { resetPasswordSms } from 'api/auth';
import { useMutation } from '@tanstack/react-query';
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
  passwordCheck: string,
  newPassword: string,
  newPasswordCheck: string,
}

function PCResetPasswordPhone({ onNext, onBack }: PCResetPasswordPhoneProps) {
  const {
    control, getValues, trigger,
  } = useFormContext<PasswordResetFormValues>();

  const newPassword = useWatch({ control, name: 'newPassword' });
  const newPasswordCheck = useWatch({ control, name: 'newPasswordCheck' });

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

  const { mutate: submitResetPassword } = useMutation({
    mutationFn: resetPasswordSms,
    onSuccess: () => {
      onNext(); // 완료 페이지로 이동
    },
    onError: (err) => {
      if (isKoinError(err)) {
        showToast('error', '비밀번호 재설정에 실패했습니다.');
      }
    },
  });

  const onClickSubmit = () => {
    const { loginId, phoneNumber } = getValues();
    submitResetPassword({
      login_id: loginId,
      phone_number: phoneNumber,
      new_password: newPassword,
    });
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
                  trigger('passwordCheck');
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
        onClick={onClickSubmit}
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
