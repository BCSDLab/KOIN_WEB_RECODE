import { isKoinError } from '@bcsdlab/koin';
import { useMutation } from '@tanstack/react-query';
import {
  checkId, emailDuplicateCheck, nicknameDuplicateCheck, signupStudent,
} from 'api/auth';
import { useEffect, useState } from 'react';
import {
  Controller, FieldError, useFormContext, useFormState, useWatch,
} from 'react-hook-form';
import { REGEX, MESSAGES } from 'static/auth';
import CustomInput, { type InputMessage } from 'pages/Auth/SignupPage/components/CustomInput';
import CustomSelector from 'pages/Auth/SignupPage/components/CustomSelector';
import useDeptList from 'pages/Auth/SignupPage/hooks/useDeptList';
import { cn } from '@bcsdlab/utils';
import BackIcon from 'assets/svg/arrow-back.svg';
import showToast from 'utils/ts/showToast';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import styles from './StudentDetailStep.module.scss';

interface VerificationProps {
  onNext: () => void;
  onBack: () => void;
}

interface StudentFormValues {
  name: string,
  phone_number: string,
  login_id: string,
  password: string,
  password_check?: string,
  department: string,
  student_number: string,
  gender: string,
  email: string | null,
  nickname: string | null,
}

function StudentDetail({ onNext, onBack }: VerificationProps) {
  const {
    control, getValues, handleSubmit, trigger,
  } = useFormContext<StudentFormValues>();

  const { errors } = useFormState({ control });

  const loginId = (useWatch({ control, name: 'login_id' }) ?? '') as string;
  const passwordCheck = useWatch({ control, name: 'password_check' });
  const nicknameControl = (useWatch({ control, name: 'nickname' }) ?? '') as string;
  const emailControl = (useWatch({ control, name: 'email' }) ?? '') as string;
  const studentNumber = (useWatch({ control, name: 'student_number' }) ?? '') as string;

  const [isCorrectId, setIsCorrectId, setInCorrectId] = useBooleanState(false);
  const [isCorrectNickname, setIsCorrectNickname, setIsInCorrectNickname] = useBooleanState(false);

  const [major, setMajor] = useState<string | null>(null);
  const [idMessage, setIdMessage] = useState<InputMessage | null>(null);
  const [nicknameMessage, setNicknameMessage] = useState<InputMessage | null>(null);

  const [emailMessage, setEmailMessage] = useState<InputMessage | null>(null);
  const isEmailValidOrEmpty = !emailControl || !errors.email;

  const isIdPasswordValid = loginId && isCorrectId && passwordCheck && !errors.password_check;
  const isFormFilled = isIdPasswordValid
    && isEmailValidOrEmpty
    && major
    && (!nicknameControl || isCorrectNickname)
    && studentNumber
    && !errors.student_number;

  const { data: deptList } = useDeptList();
  const deptOptionList = deptList.map((dept) => ({
    label: dept.name,
    value: dept.name,
  }));

  const { mutate: checkEmail } = useMutation({
    mutationFn: emailDuplicateCheck,
    onSuccess: () => {
      setEmailMessage({ type: 'success', content: MESSAGES.EMAIL.AVAILABLE });
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

  const { mutate: signup } = useMutation({
    mutationFn: (variables: StudentFormValues) => signupStudent(variables),
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

  const onSubmit = async (formData: StudentFormValues) => {
    const {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      password_check, email, nickname, ...signupData
    } = formData;
    const completeEmail = email ? `${email}@koreatech.ac.kr` : null;
    const completeNickname = nickname || null;

    signup({
      ...signupData,
      email: completeEmail,
      nickname: completeNickname,
    });
  };

  const checkAndSubmit = () => {
    const emailId = getValues('email');

    if (!emailId) {
      handleSubmit(onSubmit)();
      return;
    }

    const completeEmail = emailId ? `${emailId}@koreatech.ac.kr` : '';

    checkEmail(completeEmail, {
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

  useEffect(() => {
    setIdMessage(null);
    setInCorrectId();
  }, [loginId, setInCorrectId]);

  useEffect(() => {
    setNicknameMessage(null);
    setIsInCorrectNickname();
  }, [nicknameControl, setIsInCorrectNickname]);

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
        </div>

        <div className={styles['form-container']}>
          <div className={styles['name-wrapper']}>
            <label
              htmlFor="password"
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
              htmlFor="password_check"
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
                  message={getPasswordCheckMessage(field.value, fieldState.error)}
                />
              )}
            />
          </div>
        </div>

        <div className={styles['form-container']}>
          <div className={styles['name-wrapper']}>
            <label
              htmlFor="nickname"
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
              render={({ field, fieldState }) => (
                <CustomInput
                  {...field}
                  placeholder="닉네임은 변경 가능합니다."
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
        </div>

        <div className={styles['form-container']}>
          <div className={styles['name-wrapper']}>
            <label
              htmlFor="email"
              className={styles.wrapper__label}
            >
              이메일 (선택)
            </label>

            <div className={styles['email-input-wrapper']}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  pattern: {
                    value: REGEX.STUDENTEMAIL,
                    message: '',
                  },
                }}
                render={({ field, fieldState }) => (
                  <CustomInput
                    {...field}
                    placeholder="이메일을 입력해 주세요."
                    message={getEmailMessage(field.value, fieldState.error)}
                    onChange={(e) => {
                      const { value } = e.target;
                      field.onChange(e);
                      if (value === '') {
                        setEmailMessage(null);
                      }
                    }}
                    userType="학생"
                    value={field.value ?? ''}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className={styles['form-container']}>
          <div className={styles['name-wrapper']}>
            <label
              htmlFor="department"
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
              htmlFor="student_number"
              className={styles.wrapper__label}
            >
              학번
              <span className={styles.required}>*</span>
            </label>
            <Controller
              name="student_number"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: {
                  value: REGEX.STUDENT_NUMBER,
                  message: '',
                },
              }}
              render={({ field, fieldState }) => (
                <CustomInput
                  {...field}
                  placeholder="학번을 입력해주세요."
                  isDelete
                  message={fieldState.error ? { type: 'warning', content: MESSAGES.STUDENT_NUMBER.FORMAT } : null}
                />
              )}
            />
          </div>
        </div>
      </form>

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
          회원가입 완료
        </button>
      </div>
    </div>
  );
}

export default StudentDetail;
