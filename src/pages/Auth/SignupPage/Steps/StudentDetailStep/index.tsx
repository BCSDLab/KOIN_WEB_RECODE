import { isKoinError } from '@bcsdlab/koin';
import { useMutation } from '@tanstack/react-query';
import { nicknameDuplicateCheck, signupStudent } from 'api/auth';
import { useState } from 'react';
import {
  Controller, useFormContext, useFormState, useWatch,
} from 'react-hook-form';
import { REGEX, MESSAGES } from 'static/auth';
import CustomInput, { type InputMessage } from 'pages/Auth/SignupPage/components/CustomInput';
import CustomSelector from 'pages/Auth/SignupPage/components/CustomSelector';
import useDeptList from 'pages/Auth/SignupPage/hooks/useDeptList';
import styles from './StudentDetailStep.module.scss';

interface VerificationProps {
  onNext: () => void;
}

interface StudentFormValues {
  name: string,
  phone_number: string,
  user_id: string,
  password: string,
  password_check?: string,
  department: string,
  student_number: string,
  gender: string,
  email: string,
  nickname: string,
}

function StudentDetail({ onNext }: VerificationProps) {
  const {
    control, getValues, handleSubmit, trigger,
  } = useFormContext<StudentFormValues>();
  const phoneNumber = getValues('phone_number');
  const nickname = (useWatch({ control, name: 'nickname' }) ?? '') as string;
  const id = (useWatch({ control, name: 'user_id' }) ?? '') as string;

  const password = useWatch({ control, name: 'password' });
  const passwordCheck = useWatch({ control, name: 'password_check' });
  const { errors } = useFormState({ control });

  const isPasswordPatternValid = REGEX.PASSWORD.test(password || '');
  const isPasswordValid = isPasswordPatternValid && !errors.password;
  const isPasswordCheckValid = passwordCheck && !errors.password_check;
  const isPasswordAllValid = isPasswordValid && isPasswordCheckValid;

  const [major, setMajor] = useState<string | null>(null);
  const [phoneMessage, setPhoneMessage] = useState<InputMessage | null>(null);
  const [idMessage, setIdMessage] = useState<InputMessage | null>(null);
  const isFormFilled = isPasswordAllValid && major && nickname;

  const { data: deptList } = useDeptList();
  const deptOptionList = deptList.map((dept) => ({
    label: dept.name,
    value: dept.name,
  }));

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
    mutationFn: (variables: StudentFormValues) => signupStudent(variables),
    onSuccess: () => {
      onNext();
    },
  });

  const onSubmit = (formData: StudentFormValues) => {
    const { password_check, ...signupData } = formData;
    signup(signupData);
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

      <form onSubmit={handleSubmit(onSubmit)} className={styles['form-wrapper']}>
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
                  buttonOnClick={() => checkNickname(nickname)} // 중복 api는 다음 pr에서 연결할 예정입니다.
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
              render={({ field, fieldState }) => (
                <CustomInput
                  {...field}
                  placeholder="비밀번호를 한번 더 입력해 주세요."
                  type="password"
                  isVisibleButton
                  message={fieldState.error
                    ? { type: 'warning', content: MESSAGES.PASSWORD.MISMATCH }
                    : { type: 'success', content: MESSAGES.PASSWORD.MATCH }}
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
                required: true,
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
                  message={phoneMessage}
                  buttonText="중복 확인"
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
              <span className={styles.required}>*</span>
            </label>
            <Controller
              name="phone_number"
              control={control}
              defaultValue={phoneNumber}
              render={({ field }) => (
                <CustomInput {...field} disabled />
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
              학부
              <span className={styles.required}>*</span>
            </label>
            <Controller
              name="department"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <CustomSelector
                  {...field}
                  options={deptOptionList}
                  value={major}
                  onChange={(event) => {
                    setMajor(event.target.value);
                    field.onChange(event.target.value);
                  }}
                  placeholder="학부를 선택해주세요."
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
              학번
              <span className={styles.required}>*</span>
            </label>
            <Controller
              name="student_number"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <CustomInput {...field} placeholder="학번을 입력해주세요." isDelete />
              )}
            />
          </div>
        </div>

        <div className={`${styles.divider} ${styles['divider--bottom']}`} />

        <button
          type="submit"
          onClick={() => {
          // onSubmit(getValues());
            onNext();
          }}
          className={styles['next-button']}
          disabled={!isFormFilled}
        >
          회원가입 완료
        </button>
      </form>
    </div>
  );
}

export default StudentDetail;
