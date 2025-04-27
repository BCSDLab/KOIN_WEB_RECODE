/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-restricted-imports */
import { isKoinError } from '@bcsdlab/koin';
import { useMutation } from '@tanstack/react-query';
import { nicknameDuplicateCheck, signupGeneral } from 'api/auth';
import { useState } from 'react';
import {
  Controller, useFormContext, useFormState, useWatch,
} from 'react-hook-form';
import { REGEX, MESSAGES } from 'static/auth';
import CustomInput, { type InputMessage } from '../../components/CustomInput';
import styles from './MobileExternalDetailStep.module.scss';

interface MobileExternalDetailStepProps {
  onNext: () => void;
}

interface GeneralFormValues {
  name: string;
  phone_number: string;
  user_id: string;
  password: string;
  gender: string;
  email: string;
  nickname: string;
  password_check?: string;
}

function MobileExternalDetailStep({ onNext }: MobileExternalDetailStepProps) {
  const {
    control, getValues, handleSubmit, trigger,
  } = useFormContext<GeneralFormValues>();
  const nickname = (useWatch({ control, name: 'nickname' }) ?? '') as string;

  const password = useWatch({ control, name: 'password' });
  const passwordCheck = useWatch({ control, name: 'password_check' });
  const { errors } = useFormState({ control });

  const isPasswordPatternValid = REGEX.PASSWORD.test(password || '');
  const isPasswordValid = isPasswordPatternValid && !errors.password;
  const isPasswordCheckValid = passwordCheck && !errors.password_check;
  const isPasswordAllValid = isPasswordValid && isPasswordCheckValid;

  const [phoneMessage, setPhoneMessage] = useState<InputMessage | null>(null);
  const isFormFilled = isPasswordAllValid && nickname;

  const { mutate: checkNickname } = useMutation({
    mutationFn: nicknameDuplicateCheck,
    onSuccess: () => {
      setPhoneMessage({ type: 'success', content: MESSAGES.NICKNAME.AVAILABLE });
    },
    onError: (err) => {
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

  const { mutate: signup } = useMutation({
    mutationFn: (variables: GeneralFormValues) => signupGeneral(variables),
    onSuccess: () => {
      onNext();
    },
  });

  const onSubmit = (formData: GeneralFormValues) => {
    const { password_check, ...signupData } = formData;
    signup(signupData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      <div className={styles['form-container']}>
        <div className={styles.wrapper}>
          <h1 className={styles.wrapper__header}>사용하실 아이디를 입력해 주세요.</h1>
          <Controller
            name="user_id"
            control={control}
            rules={{
              required: true,
              pattern: {
                value: REGEX.USERID,
                message: '',
              },
            }}
            render={({ field }) => (
              <CustomInput
                {...field}
                placeholder="최대 13자리까지 입력 가능합니다."
                isButton
                buttonText="중복 확인"
                // buttonOnClick={}
                // USERID 여기서 메세지 가져와서 쓰기
              />
            )}
          />
          <div className={styles['input-wrapper']}>
            <Controller
              name="nickname"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: {
                  value: REGEX.NICKNAME,
                  message: '',
                },
              }}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  placeholder="닉네임을 입력해 주세요. (선택)"
                  isDelete
                  isButton
                  message={phoneMessage}
                  buttonText="중복 확인"
                  buttonOnClick={() => checkNickname(nickname)}
                  buttonDisabled={!nickname}
                />
              )}
            />
          </div>
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
                    message={fieldState.error
                      ? { type: 'warning', content: MESSAGES.PASSWORD.MISMATCH }
                      : { type: 'success', content: MESSAGES.PASSWORD.MATCH }}
                  />
                )}
              />
            )}

          </div>
        </div>
      </div>

      <button
        type="submit"
        onClick={() => {
          // onSubmit(getValues());
          onNext();
        }}
        className={styles['next-button']}
        disabled={!isFormFilled}
      >
        다음
      </button>
    </form>

  );
}

export default MobileExternalDetailStep;
