/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-restricted-imports */
import { isKoinError } from '@bcsdlab/koin';
import { useMutation } from '@tanstack/react-query';
import { checkId, nicknameDuplicateCheck, signupGeneral } from 'api/auth';
import { useState } from 'react';
import {
  Controller, FieldError, useFormContext, useFormState, useWatch,
} from 'react-hook-form';
import { REGEX, MESSAGES } from 'static/auth';
import showToast from 'utils/ts/showToast';
import CustomInput, { type InputMessage } from '../../components/CustomInput';
import styles from './MobileExternalDetailStep.module.scss';

interface MobileExternalDetailStepProps {
  onNext: () => void;
}

interface GeneralFormValues {
  name: string;
  phone_number: string;
  login_id: string;
  password: string;
  gender: string;
  email: string | null,
  nickname: string | null,
  password_check?: string;
  department?: string;
  student_number?: string;
}

function MobileExternalDetailStep({ onNext }: MobileExternalDetailStepProps) {
  const {
    control, getValues, handleSubmit, trigger,
  } = useFormContext<GeneralFormValues>();
  const nicknameControl = (useWatch({ control, name: 'nickname' }) ?? '') as string;
  const loginId = (useWatch({ control, name: 'login_id' }) ?? '') as string;

  const password = useWatch({ control, name: 'password' });
  const passwordCheck = useWatch({ control, name: 'password_check' });
  const { errors } = useFormState({ control });

  const isPasswordPatternValid = REGEX.PASSWORD.test(password || '');
  const isPasswordValid = isPasswordPatternValid && !errors.password;
  const isPasswordCheckValid = passwordCheck && !errors.password_check;
  const isPasswordAllValid = isPasswordValid && isPasswordCheckValid;

  const [idMessage, setIdMessage] = useState<InputMessage | null>(null);
  const [nicknameMessage, setNicknameMessage] = useState<InputMessage | null>(null);
  const isIdPasswordValid = loginId && passwordCheck && !errors.password_check;
  const isFormFilled = loginId && isPasswordAllValid;

  const { mutate: checkNickname } = useMutation({
    mutationFn: nicknameDuplicateCheck,
    onSuccess: () => {
      setNicknameMessage({ type: 'success', content: MESSAGES.NICKNAME.AVAILABLE });
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) {
          setNicknameMessage({ type: 'warning', content: MESSAGES.NICKNAME.FORMAT });
        }

        if (err.status === 409) {
          setNicknameMessage({ type: 'error', content: MESSAGES.NICKNAME.DUPLICATED });
        }
      }
    },
  });

  const { mutate: checkUserId } = useMutation({
    mutationFn: checkId,
    onSuccess: () => {
      setIdMessage({ type: 'success', content: MESSAGES.USERID.AVAILABLE });
    },
    onError: (err) => {
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
      showToast('success', '회원가입이 완료되었습니다.');
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

  const onSubmit = (formData: GeneralFormValues) => {
    const {
      password_check, email, nickname, department, student_number, ...signupData
    } = formData;
    const completeEmail = email || null;
    const completeNickname = nickname || null;

    signup({
      ...signupData,
      email: completeEmail,
      nickname: completeNickname,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      <div className={styles['form-container']}>
        <div className={styles.wrapper}>
          <h1 className={styles.wrapper__header}>사용하실 아이디를 입력해 주세요.</h1>
          <Controller
            name="login_id"
            control={control}
            rules={{
              required: true,
              pattern: {
                value: REGEX.USERID,
                message: '',
              },
            }}
            render={({ field, fieldState }) => (
              <CustomInput
                {...field}
                placeholder="5~13자리로 입력해 주세요."
                isButton
                message={fieldState.error ? { type: 'warning', content: MESSAGES.USERID.REQUIRED } : idMessage}
                buttonText="중복 확인"
                buttonDisabled={!!fieldState.error || !field.value}
                buttonOnClick={() => checkUserId(loginId)}
              />
            )}
          />
        </div>
        <div className={styles['form-container']}>
          <div className={styles.wrapper}>
            <h1 className={styles.wrapper__header}>사용하실 비밀번호를 입력해 주세요.</h1>
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
            {isPasswordValid && (
              <Controller
                name="password_check"
                control={control}
                defaultValue=""
                rules={{
                  required: true,
                  validate: (value) => value === getValues('password'),
                }}
                render={({ field, fieldState }) => (
                  <CustomInput
                    {...field}
                    placeholder="비밀번호를 다시 입력해 주세요."
                    type="password"
                    isVisibleButton
                    message={getPasswordCheckMessage(field.value, fieldState.error)}
                  />
                )}
              />
            )}
            {
              isIdPasswordValid && (
                <>
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
                        <CustomInput
                          {...field}
                          placeholder="닉네임을 입력해 주세요. (선택)"
                          isDelete
                          isButton
                          message={fieldState.error ? { type: 'warning', content: MESSAGES.NICKNAME.FORMAT } : nicknameMessage}
                          buttonText="중복 확인"
                          buttonOnClick={() => checkNickname(nicknameControl)}
                          buttonDisabled={!nicknameControl}
                          value={field.value ?? ''}
                        />
                      )}
                    />
                  </div>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{
                      pattern: {
                        value: REGEX.EMAIL,
                        message: '',
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <CustomInput
                        message={fieldState.error ? { type: 'warning', content: MESSAGES.EMAIL.FORMAT } : null}
                        {...field}
                        placeholder="이메일을 입력해 주세요. (선택)"
                        value={field.value ?? ''}
                      />
                    )}
                  />
                </>
              )
            }
          </div>
        </div>
      </div>
      <button
        type="submit"
        className={styles['next-button']}
        disabled={!isFormFilled}
      >
        다음
      </button>
    </form>

  );
}

export default MobileExternalDetailStep;
