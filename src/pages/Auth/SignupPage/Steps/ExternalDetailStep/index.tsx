/* eslint-disable @typescript-eslint/naming-convention */
import { isKoinError } from '@bcsdlab/koin';
import { useMutation } from '@tanstack/react-query';
import {
  checkId, emailDuplicateCheck, nicknameDuplicateCheck, signupGeneral,
} from 'api/auth';
import { useState } from 'react';
import {
  Controller, FieldError, useFormContext, useFormState, useWatch,
} from 'react-hook-form';
import { REGEX, MESSAGES } from 'static/auth';
import PCCustomInput, { type InputMessage } from 'pages/Auth/SignupPage/components/PCCustomInput';
import BackIcon from 'assets/svg/arrow-back.svg';
import { cn, sha256 } from '@bcsdlab/utils';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import showToast from 'utils/ts/showToast';
import styles from './ExternalDetailStep.module.scss';

interface ExternalDetailStepProps {
  onNext: () => void;
  onBack: () => void;
}

interface GeneralFormValues {
  name: string;
  phone_number: string;
  login_id: string;
  password: string;
  password_check?: string;
  gender: string;
  email: string | null;
  nickname: string | null;
  marketing_notification_agreement: boolean;
}

function ExternalDetail({ onNext, onBack }: ExternalDetailStepProps) {
  const {
    control, getValues, handleSubmit, trigger,
  } = useFormContext<GeneralFormValues>();

  const { errors } = useFormState({ control });

  const loginId = (useWatch({ control, name: 'login_id' }) ?? '') as string;
  const passwordCheck = useWatch({ control, name: 'password_check' });
  const nicknameControl = (useWatch({ control, name: 'nickname' }) ?? '') as string;
  const emailControl = (useWatch({ control, name: 'email' }) ?? '') as string;

  const [isCorrectId, setIsCorrectId, setInCorrectId] = useBooleanState(false);
  const [isCorrectNickname, setIsCorrectNickname, setInCorrectNickname] = useBooleanState(false);
  const [, setIsCorrectEmail, setInCorrectEmail] = useBooleanState(false);

  const [idMessage, setIdMessage] = useState<InputMessage | null>(null);
  const [nicknameMessage, setNicknameMessage] = useState<InputMessage | null>(null);

  const [emailMessage, setEmailMessage] = useState<InputMessage | null>(null);
  const isEmailValidOrEmpty = !emailControl || !errors.email;

  const isIdPasswordValid = loginId && isCorrectId && passwordCheck && !errors.password_check;
  const isFormFilled = isIdPasswordValid
    && isEmailValidOrEmpty
    && (!nicknameControl || isCorrectNickname);

  const { mutate: checkEmail } = useMutation({
    mutationFn: emailDuplicateCheck,
    onSuccess: () => {
      setEmailMessage({ type: 'success', content: MESSAGES.EMAIL.AVAILABLE });
      setIsCorrectEmail();
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) {
          setEmailMessage({ type: 'warning', content: MESSAGES.EMAIL.FORMAT });
        }

        if (err.status === 409) {
          setEmailMessage({ type: 'error', content: MESSAGES.EMAIL.DUPLICATED });
        }
      }
    },
  });

  const { mutate: checkNickname } = useMutation({
    mutationFn: nicknameDuplicateCheck,
    onSuccess: () => {
      setNicknameMessage({ type: 'success', content: MESSAGES.NICKNAME.AVAILABLE });
      setIsCorrectNickname();
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) setNicknameMessage({ type: 'warning', content: MESSAGES.NICKNAME.FORMAT });

        if (err.status === 409)setNicknameMessage({ type: 'error', content: MESSAGES.NICKNAME.DUPLICATED });
      }
    },
  });

  const { mutate: checkUserId } = useMutation({
    mutationFn: checkId,
    onSuccess: () => {
      setIdMessage({ type: 'success', content: MESSAGES.USERID.AVAILABLE });
      setIsCorrectId();
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) setIdMessage({ type: 'warning', content: MESSAGES.USERID.INVALID });

        if (err.status === 409) setIdMessage({ type: 'error', content: MESSAGES.USERID.DUPLICATED });
      }
    },
  });

  const { mutate: signup, isPending } = useMutation({
    mutationFn: (variables: GeneralFormValues) => signupGeneral(variables),
    onSuccess: () => {
      onNext();
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) {
          showToast('error', '회원가입에 실패했습니다. 다시 시도해 주세요.');
        }
      }
    },
  });

  const onSubmit = async (formData: GeneralFormValues) => {
    const hashedPassword = await sha256(formData.password);
    const payload = {
      name: formData.name,
      nickname: formData.nickname?.trim() || null,
      email: formData.email?.trim() || null,
      phone_number: formData.phone_number,
      gender: formData.gender,
      login_id: formData.login_id,
      password: hashedPassword,
      marketing_notification_agreement: formData.marketing_notification_agreement,
    };

    signup(payload);
  };

  const checkAndSubmit = () => {
    const emailId = getValues('email');

    if (!emailId) {
      handleSubmit(onSubmit)();
      return;
    }

    checkEmail(emailId, {
      onSuccess: () => {
        handleSubmit(onSubmit)();
      },
    });
  };

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

  const getEmailMessage = (fieldValue: string | null, fieldError: FieldError | undefined)
  : InputMessage | null => {
    if (fieldValue === '') return null;
    if (fieldError) return { type: 'warning', content: MESSAGES.EMAIL.FORMAT };
    return emailMessage;
  };

  return (
    <div className={styles.container}>
      <div className={styles.container__wrapper}>
        <div className={styles['container__title-wrapper']}>
          <button type="button" onClick={onBack} aria-label="뒤로가기">
            <BackIcon />
          </button>
          <h1 className={styles['container__title-wrapper--title']}>회원가입</h1>
          <div className={styles['container__title-wrapper--icon']}>
            <BackIcon />
          </div>
        </div>
        <div className={styles.container__subTitleWrapper}>
          <span className={styles['container__subTitleWrapper-subTitle']}>
            <span className={styles.required}>*</span>
            필수 입력사항
          </span>
        </div>
        <div className={`${styles.divider} ${styles['divider--top']}`} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles['form-wrapper']}>

        <div className={styles['input-wrapper']}>
          <Controller
            name="login_id"
            control={control}
            defaultValue=""
            rules={{
              required: true,
              pattern: {
                value: REGEX.USERID,
                message: '',
              },
            }}
            render={({ field, fieldState }) => (
              <div className={styles['input-with-button']}>
                <PCCustomInput
                  {...field}
                  htmlFor="login_id"
                  labelName="아이디"
                  isRequired
                  onChange={(e) => {
                    field.onChange(e);
                    setIdMessage(null);
                    setInCorrectId();
                  }}
                  placeholder="최대 13자리까지 입력 가능합니다."
                  message={fieldState.error ? { type: 'warning', content: MESSAGES.USERID.REQUIRED } : idMessage}
                />
                <button
                  type="button"
                  onClick={() => checkUserId(loginId)}
                  className={styles['check-button']}
                  disabled={!field.value}
                >
                  중복 확인
                </button>
              </div>
            )}
          />
        </div>

        <div className={styles['input-wrapper']}>
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
              <PCCustomInput
                {...field}
                htmlFor="password"
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
            name="password_check"
            control={control}
            defaultValue=""
            rules={{
              required: true,
              validate: (value) => value === getValues('password'),
            }}
            render={({ field, fieldState }) => (
              <PCCustomInput
                {...field}
                htmlFor="password_check"
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

        <div className={styles['input-wrapper']}>
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
            render={({ field, fieldState }) => (
              <div className={styles['input-with-button']}>
                <PCCustomInput
                  {...field}
                  htmlFor="nickname"
                  labelName="닉네임 (선택)"
                  onChange={(e) => {
                    field.onChange(e);
                    setNicknameMessage(null);
                    setInCorrectNickname();
                  }}
                  placeholder="닉네임은 변경 가능합니다."
                  isDelete
                  message={fieldState.error ? { type: 'warning', content: MESSAGES.NICKNAME.FORMAT } : nicknameMessage}
                  value={field.value ?? ''}
                />
                <button
                  type="button"
                  onClick={() => checkNickname(nicknameControl)}
                  className={styles['check-button']}
                  disabled={!nicknameControl}
                >
                  중복 확인
                </button>
              </div>
            )}
          />
        </div>

        <div className={styles['input-wrapper']}>
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
            render={({ field, fieldState }) => (
              <PCCustomInput
                {...field}
                htmlFor="email"
                labelName="이메일 (선택)"
                placeholder="이메일을 입력해 주세요."
                message={getEmailMessage(field.value, fieldState.error)}
                onChange={(e) => {
                  field.onChange(e);
                  setEmailMessage(null);
                  setInCorrectEmail();
                }}
                value={field.value ?? ''}
              />
            )}
          />
        </div>

        <div className={styles.container__wrapper}>
          <div className={`${styles.divider} ${styles['divider--bottom']}`} />
          <button
            type="button"
            onClick={checkAndSubmit}
            className={cn({
              [styles['next-button']]: true,
              [styles['next-button--active']]: Boolean(isFormFilled),
            })}
            disabled={!isFormFilled}
          >
            {isPending ? '...' : '회원가입 완료'}
          </button>
        </div>
      </form>

    </div>
  );
}

export default ExternalDetail;
