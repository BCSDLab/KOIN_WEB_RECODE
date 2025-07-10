import {
  Controller, FieldError, useFormContext, useWatch,
} from 'react-hook-form';
import {
  resetPasswordEmail, resetPasswordSms,
} from 'api/auth';
import { useMutation } from '@tanstack/react-query';
import { isKoinError } from '@bcsdlab/koin';
import { cn, sha256 } from '@bcsdlab/utils';
import CustomInput, { type InputMessage } from 'pages/Auth/SignupPage/components/CustomInput';
import showToast from 'utils/ts/showToast';
import { ContactType, MESSAGES, REGEX } from 'static/auth';
import styles from './MobileResetPassword.module.scss';

interface MobileResetPasswordProps {
  onNext: () => void;
  onBack: () => void;
  contactType: ContactType;
}

interface PasswordResetFormValues {
  loginId: string,
  contactType: ContactType,
  phoneNumber: string,
  email: string,
  verificationCode: string,
  password: string,
  passwordCheck: string,
  newPassword: string,
  newPasswordCheck: string,
}

function MobileResetPassword({ onNext, contactType }: MobileResetPasswordProps) {
  const {
    control, getValues, trigger,
  } = useFormContext<PasswordResetFormValues>();

  const newPassword = useWatch({ control, name: 'newPassword' });
  const newPasswordCheck = useWatch({ control, name: 'newPasswordCheck' });

  const isFormFilled = newPassword && newPasswordCheck;
  const isPasswordMatched = newPassword === newPasswordCheck;

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

  const { mutate: submitResetPasswordSms } = useMutation({
    mutationFn: resetPasswordSms,
    onSuccess: () => {
      onNext();
    },
    onError: (err) => {
      if (isKoinError(err)) {
        showToast('error', '비밀번호 재설정에 실패했습니다.');
      }
    },
  });

  const { mutate: submitResetPasswordEmail } = useMutation({
    mutationFn: resetPasswordEmail,
    onSuccess: () => {
      onNext();
    },
    onError: (err) => {
      if (isKoinError(err)) {
        showToast('error', '비밀번호 재설정에 실패했습니다.');
      }
    },
  });

  const onClickSubmit = async () => {
    const { loginId, email, phoneNumber } = getValues();
    const hashedPassword = await sha256(newPassword);

    if (contactType === 'PHONE') {
      submitResetPasswordSms({
        login_id: loginId,
        phone_number: phoneNumber,
        new_password: hashedPassword,
      });
    } else {
      submitResetPasswordEmail({
        login_id: loginId,
        email,
        new_password: hashedPassword,
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles['form-container']}>
        <div className={styles.wrapper}>
          <h1 className={styles.wrapper__header}>새 비밀번호</h1>
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
              <CustomInput
                {...field}
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

        <div className={styles.wrapper}>
          <h1 className={styles.wrapper__header}>비밀번호 확인</h1>
          <Controller
            name="newPasswordCheck"
            control={control}
            defaultValue=""
            rules={{
              required: true,
              validate: (value) => value === getValues('newPassword'),
            }}
            render={({ field, fieldState }) => (
              <CustomInput
                {...field}
                placeholder="비밀번호를 다시 입력해 주세요."
                type="password"
                value={field.value}
                isVisibleButton
                message={getPasswordCheckMessage(field.value, fieldState.error)}
              />
            )}
          />
        </div>
      </div>

      <button
        type="submit"
        onClick={onClickSubmit}
        className={cn({
          [styles['button-next']]: true,
          [styles['button-next--active']]: Boolean(isFormFilled && isPasswordMatched),
        })}
        disabled={!isFormFilled || !isPasswordMatched}
      >
        다음
      </button>
    </div>
  );
}

export default MobileResetPassword;
