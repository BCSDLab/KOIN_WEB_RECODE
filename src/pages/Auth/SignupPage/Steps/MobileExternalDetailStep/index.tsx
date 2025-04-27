/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-restricted-imports */
import { isKoinError } from '@bcsdlab/koin';
import { useMutation } from '@tanstack/react-query';
import { nicknameDuplicateCheck, signupGeneral } from 'api/auth';
import { useState } from 'react';
import {
  Controller, useFormContext, useFormState, useWatch,
} from 'react-hook-form';
import CustomInput, { type InputMessage } from '../../components/CustomInput';
import styles from './MobileExternalDetailStep.module.scss';

const MESSAGES = {
  PASSWORD_FORMAT: '올바른 비밀번호 양식이 아닙니다. 다시 입력해 주세요.',
  PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',
  PASSWORD_MATCH: '비밀번호가 일치합니다.',

  NICKNAME_DUPLICATED: '중복된 닉네임입니다. 다시 입력해 주세요.',
  NICKNAME_AVAILABLE: '사용 가능한 닉네임입니다.',
  NICKNAME_FORMAT: '한글, 영문 및 숫자 포함하여 10자 내로 입력해 주세요.',
};

const REGEX = {
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`[\]{}|\\:;"'<>,.?/])[A-Za-z\d!@#$%^&*()_\-+=~`[\]{}|\\:;"'<>,.?/]{6,18}$/,
  NICKNAME: /^[가-힣a-zA-Z0-9]{1,10}$/,
};

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
  const { control, getValues, handleSubmit } = useFormContext<GeneralFormValues>();
  const phoneNumber = getValues('phone_number');
  const nickname = (useWatch({ control, name: 'nickname' }) ?? '') as string;

  const password = useWatch({ control, name: 'password' });
  const passwordCheck = useWatch({ control, name: 'password_check' });
  const { errors } = useFormState({ control });

  const isPasswordValid = password && !errors.password;
  const isPasswordCheckValid = passwordCheck && !errors.password_check;
  const isPasswordAllValid = isPasswordValid && isPasswordCheckValid;

  const [phoneMessage, setPhoneMessage] = useState<InputMessage | null>(null);
  const isFormFilled = isPasswordAllValid && nickname;

  const { mutate: checkNickname } = useMutation({
    mutationFn: nicknameDuplicateCheck,
    onSuccess: () => {
      setPhoneMessage({ type: 'success', content: MESSAGES.NICKNAME_AVAILABLE });
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) {
          setPhoneMessage({ type: 'warning', content: MESSAGES.NICKNAME_FORMAT });
        }

        if (err.status === 409) {
          setPhoneMessage({ type: 'error', content: MESSAGES.NICKNAME_DUPLICATED });
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
          <h1 className={styles.wrapper__header}>아이디 (전화번호)</h1>
          <Controller
            name="phone_number"
            control={control}
            defaultValue={phoneNumber}
            render={({ field }) => (
              <CustomInput {...field} disabled />
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
                  message: MESSAGES.PASSWORD_FORMAT,
                },
              }}
              render={({ field, fieldState }) => (
                <CustomInput
                  {...field}
                  placeholder="특수문자 포함 영어와 숫자 6~18자리로 입력해주세요."
                  type="password"
                  isVisibleButton
                  message={fieldState.error ? { type: 'warning', content: MESSAGES.PASSWORD_FORMAT } : null}
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
                      ? { type: 'warning', content: MESSAGES.PASSWORD_MISMATCH }
                      : { type: 'success', content: MESSAGES.PASSWORD_MATCH }}
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
