import { isKoinError } from '@bcsdlab/koin';
import { useMutation } from '@tanstack/react-query';
import { checkId, nicknameDuplicateCheck, signupGeneral } from 'api/auth';
import { useState } from 'react';
import {
  Controller, FieldError, useFormContext, useFormState, useWatch,
} from 'react-hook-form';
import { REGEX, MESSAGES } from 'static/auth';
import CustomInput, { type InputMessage } from 'pages/Auth/SignupPage/components/CustomInput';
import { cn } from '@bcsdlab/utils';
import styles from './ExternalDetailStep.module.scss';

interface ExternalDetailStepProps {
  onNext: () => void;
}

interface GeneralFormValues {
  name: string,
  phone_number: string,
  user_id: string,
  password: string,
  password_check?: string,
  gender: string,
  email: string | null,
  nickname: string | null,
}

function ExternalDetail({ onNext }: ExternalDetailStepProps) {
  const {
    control, getValues, handleSubmit, trigger,
  } = useFormContext<GeneralFormValues>();
  const nickname = (useWatch({ control, name: 'nickname' }) ?? '') as string;
  const userId = (useWatch({ control, name: 'user_id' }) ?? '') as string;

  const password = useWatch({ control, name: 'password' });
  const passwordCheck = useWatch({ control, name: 'password_check' });
  const { errors } = useFormState({ control });

  const isPasswordEntered = Boolean(password);
  const isPasswordCheckEntered = Boolean(passwordCheck);

  const isPasswordPatternValid = REGEX.PASSWORD.test(password || '');
  const isPasswordValid = isPasswordPatternValid && !errors.password;
  const isPasswordCheckValid = passwordCheck && !errors.password_check;
  const isPasswordAllValid = isPasswordValid && isPasswordCheckValid;

  const isPasswordSame = password === passwordCheck;

  let passwordMessage: InputMessage | null = null;

  if (isPasswordEntered && isPasswordCheckEntered) {
    if (!isPasswordPatternValid) {
      passwordMessage = { type: 'warning', content: MESSAGES.PASSWORD.FORMAT };
    } else if (!isPasswordSame) {
      passwordMessage = { type: 'warning', content: MESSAGES.PASSWORD.MISMATCH };
    } else {
      passwordMessage = { type: 'success', content: MESSAGES.PASSWORD.MATCH };
    }
  }

  const [phoneMessage, setPhoneMessage] = useState<InputMessage | null>(null);
  const [idMessage, setIdMessage] = useState<InputMessage | null>(null);
  const [isUserIdChecked, setIsUserIdChecked] = useState(false);
  const [validatedNickname, setValidatedNickname] = useState<string | null>(null);
  const isNicknameValid = !nickname || validatedNickname === nickname;
  const isFormFilled = isPasswordAllValid && userId && isUserIdChecked && isNicknameValid;

  const getEmailCheckMessage = (
    fieldValue: string | undefined,
    fieldError: FieldError | undefined,
  ): InputMessage | undefined => {
    if (!fieldValue || !fieldError) {
      return undefined;
    }
    return { type: 'warning', content: MESSAGES.EMAIL.FORMAT };
  };

  const { mutate: checkNickname } = useMutation({
    mutationFn: nicknameDuplicateCheck,
    onSuccess: () => {
      setPhoneMessage({ type: 'success', content: MESSAGES.NICKNAME.AVAILABLE });
      setValidatedNickname(nickname);
    },
    onError: (err) => {
      setValidatedNickname(null);
      if (isKoinError(err)) {
        if (err.status === 400) {
          setPhoneMessage({ type: 'warning', content: MESSAGES.NICKNAME.FORMAT });
        }

        if (err.status === 409) {
          setPhoneMessage({ type: 'error', content: MESSAGES.NICKNAME.DUPLICATED });
        }
      }
    },
  });

  const { mutate: checkUserId } = useMutation({
    mutationFn: checkId,
    onSuccess: () => {
      setIdMessage({ type: 'success', content: MESSAGES.USERID.AVAILABLE });
      setIsUserIdChecked(true);
    },
    onError: (err) => {
      setIsUserIdChecked(false);
      if (isKoinError(err)) {
        if (err.status === 400) {
          setIdMessage({ type: 'warning', content: MESSAGES.USERID.INVALID });
        }

        if (err.status === 409) {
          setIdMessage({ type: 'error', content: MESSAGES.USERID.DUPLICATED });
        }
      }
    },
  });

  const { mutate: signup } = useMutation({
    mutationFn: (variables: GeneralFormValues) => signupGeneral(variables),
    onSuccess: () => {
      onNext();
    },
  });

  const onSubmit = (formData: GeneralFormValues) => {
    const payload = {
      name: formData.name,
      phone_number: formData.phone_number,
      user_id: formData.user_id,
      password: formData.password,
      gender: formData.gender,
      email: formData.email === '' ? null : formData.email,
      nickname: formData.nickname === '' ? null : formData.nickname,
    };

    signup(payload);
  };

  return (
    <div className={styles.container}>
      <div className={styles.container__wrapper}>
        <h1 className={styles.container__title}>회원가입</h1>
        <div className={styles.container__subTitleWrapper}>
          <span className={styles['container__subTitleWrapper-subTitle']}>
            <span className={styles.required}>*</span>
            필수 입력사항
          </span>
        </div>
        <div className={`${styles.divider} ${styles['divider--top']}`} />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles['form-wrapper']}
      >
        <div className={styles['form-container']}>
          <div className={styles['name-wrapper']}>
            <label
              htmlFor="name"
              className={styles.wrapper__label}
            >
              아이디
              <span className={styles.required}>*</span>
            </label>
            <Controller
              name="user_id"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <CustomInput
                  {...field}
                  placeholder="최대 13자리까지 입력 가능합니다."
                  isButton
                  message={idMessage}
                  buttonText="중복 확인"
                  buttonDisabled={!field.value}
                  buttonOnClick={() => checkUserId(userId)}
                />
              )}
            />
          </div>
        </div>

        <div className={styles['form-container']}>
          <div className={styles['name-wrapper']}>
            <label
              htmlFor="name"
              className={styles.wrapper__label}
            >
              비밀번호
              <span className={styles.required}>*</span>
            </label>
            <Controller
              name="password"
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
                    trigger('password_check');
                  }}
                  isVisibleButton
                  message={fieldState.error ? { type: 'warning', content: MESSAGES.PASSWORD.FORMAT } : null}
                />
              )}
            />
          </div>
        </div>

        <div className={styles['form-container']}>
          <div className={styles['name-wrapper']}>
            <label
              htmlFor="name"
              className={styles.wrapper__label}
            >
              비밀번호 확인
              <span className={styles.required}>*</span>
            </label>
            <Controller
              name="password_check"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                validate: (value) => value === getValues('password'),
              }}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  placeholder="비밀번호를 한번 더 입력해 주세요."
                  type="password"
                  isVisibleButton
                  message={passwordMessage}
                />
              )}
            />
          </div>
        </div>

        <div className={styles['form-container']}>
          <div className={styles['name-wrapper']}>
            <label
              htmlFor="name"
              className={styles.wrapper__label}
            >
              닉네임 (선택)
            </label>
            <Controller
              name="nickname"
              control={control}
              defaultValue=""
              rules={{
                pattern: {
                  value: REGEX.NICKNAME,
                  message: '',
                },
              }}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  placeholder="닉네임은 변경 가능합니다."
                  isDelete
                  isButton
                  value={field.value ?? ''}
                  message={phoneMessage}
                  buttonText="중복 확인"
                  buttonDisabled={!field.value}
                  buttonOnClick={() => checkNickname(nickname)}
                />
              )}
            />
          </div>
        </div>

        <div className={styles['form-container']}>
          <div className={styles['name-wrapper']}>
            <label
              htmlFor="name"
              className={styles.wrapper__label}
            >
              이메일(선택)
            </label>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                pattern: {
                  value: REGEX.EMAIL,
                  message: MESSAGES.EMAIL.FORMAT,
                },
              }}
              render={({ field, fieldState }) => {
                const message = getEmailCheckMessage(field.value ?? undefined, fieldState.error);
                return (
                  <CustomInput
                    {...field}
                    value={field.value ?? ''}
                    placeholder="이메일을 입력해 주세요."
                    message={message}
                  />
                );
              }}
            />
          </div>
        </div>

        <div className={styles.container__wrapper}>
          <div className={`${styles.divider} ${styles['divider--bottom']}`} />
          <button
            type="submit"
            className={cn({
              [styles['next-button']]: true,
              [styles['next-button--active']]: Boolean(isFormFilled),
            })}
            disabled={!isFormFilled}
          >
            회원가입 완료
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExternalDetail;
