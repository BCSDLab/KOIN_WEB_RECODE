/* eslint-disable no-restricted-imports */
import { useState } from 'react';
import { isKoinError } from '@bcsdlab/koin';
import { sha256 } from '@bcsdlab/utils';
import { useMutation } from '@tanstack/react-query';
import { checkId, nicknameDuplicateCheck, signupStudent } from 'api/auth';
import { Controller, ControllerRenderProps, FieldError, useFormContext, useFormState, useWatch } from 'react-hook-form';
import { REGEX, MESSAGES } from 'static/auth';
import { useSessionLogger } from 'utils/hooks/analytics/useSessionLogger';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import showToast from 'utils/ts/showToast';
import CustomInput, { type InputMessage } from '../../components/CustomInput';
import CustomSelector from '../../components/CustomSelector';
import useDeptList from '../../hooks/useDeptList';
import styles from './MobileStudentDetailStep.module.scss';

interface MobileVerificationProps {
  onNext: () => void;
}

interface StudentFormValues {
  name: string;
  phone_number: string;
  login_id: string;
  password: string;
  password_check?: string;
  department: string;
  student_number: string;
  gender: string;
  email: string | null;
  nickname: string | null;
  marketing_notification_agreement: boolean;
}

function MobileStudentDetailStep({ onNext }: MobileVerificationProps) {
  const sessionLogger = useSessionLogger();
  const { control, getValues, trigger, handleSubmit } = useFormContext<StudentFormValues>();
  const { errors, isValid } = useFormState({ control });

  const loginId = useWatch({ control, name: 'login_id' }) ?? '';
  const passwordCheck = useWatch({ control, name: 'password_check' });
  const nicknameControl = useWatch({ control, name: 'nickname' }) ?? '';

  const [isCorrectId, setIsCorrectId, setInCorrectId] = useBooleanState(false);
  const [isCorrectNickname, setIsCorrectNickname, setIsInCorrectNickname] = useBooleanState(false);
  const [major, setMajor] = useState<string | null>(null);
  const [idMessage, setIdMessage] = useState<InputMessage | null>(null);
  const [nicknameMessage, setNicknameMessage] = useState<InputMessage | null>(null);

  const isIdPasswordValid = loginId && isCorrectId && passwordCheck && !errors.password_check;

  const isFormFilled = isIdPasswordValid && major && (!nicknameControl || isCorrectNickname);

  const { data: deptList } = useDeptList();
  const deptOptionList = deptList.map((dept) => ({
    label: dept.name,
    value: dept.name,
  }));

  const { mutate: checkUserId } = useMutation({
    mutationFn: checkId,
    onSuccess: () => {
      setIdMessage({ type: 'success', content: MESSAGES.USERID.AVAILABLE });
      setIsCorrectId();
      sessionLogger.actionSessionEvent({
        event_label: 'create_account',
        value: '아이디생성',
        event_category: 'click',
        session_name: 'sign_up',
      });
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

  const { mutate: checkNickname } = useMutation({
    mutationFn: nicknameDuplicateCheck,
    onSuccess: () => {
      setNicknameMessage({ type: 'success', content: MESSAGES.NICKNAME.AVAILABLE });
      setIsCorrectNickname();
      sessionLogger.actionSessionEvent({
        event_label: 'create_account',
        value: '닉네임생성',
        event_category: 'click',
        session_name: 'sign_up',
      });
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) {
          setNicknameMessage({ type: 'warning', content: MESSAGES.NICKNAME.FORMAT });
        }

        if (err.status === 409) {
          setNicknameMessage({ type: 'warning', content: MESSAGES.NICKNAME.DUPLICATED });
        }
      }
    },
  });

  const { mutate: signup } = useMutation({
    mutationFn: (variables: StudentFormValues) => signupStudent(variables),
    onSuccess: () => {
      onNext();
      sessionLogger.actionSessionEvent({
        event_label: 'sign_up_completed',
        value: '회원가입완료',
        event_category: 'click',
        session_name: 'sign_up',
      });
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

  const onSubmit = async (formData: StudentFormValues) => {
    const { email, password, ...signupData } = formData;
    const hashedPassword = await sha256(password);
    const completeEmail = email ? `${email}@koreatech.ac.kr` : null;
    const completeNickname = nicknameControl || null;

    signup({
      ...signupData,
      password: hashedPassword,
      email: completeEmail,
      nickname: completeNickname,
    });
  };

  const handleNicknameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<StudentFormValues, 'nickname'>,
  ) => {
    field.onChange(e);
    setNicknameMessage(null);
    setIsInCorrectNickname();
  };

  const handleLoginIdChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<StudentFormValues, 'login_id'>,
  ) => {
    field.onChange(e);
    setIdMessage(null);
    setInCorrectId();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      <div className={styles['form-container']}>
        <div className={styles.wrapper}>
          <h1 className={styles.wrapper__header}>사용하실 아이디를 입력해 주세요.</h1>
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
                onChange={(e) => handleLoginIdChange(e, field)}
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
          </div>
        </div>
        {isIdPasswordValid && (
          <div className={styles.wrapper}>
            <h1 className={styles.wrapper__header}>학부와 학번을 알려주세요.</h1>
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
                    placeholder="닉네임은 변경 가능합니다. (선택)"
                    isDelete
                    isButton
                    onChange={(e) => handleNicknameChange(e, field)}
                    message={
                      fieldState.error ? { type: 'warning', content: MESSAGES.NICKNAME.FORMAT } : nicknameMessage
                    }
                    buttonText="중복 확인"
                    buttonOnClick={() => checkNickname(nicknameControl)}
                    buttonDisabled={!nicknameControl}
                    value={field.value ?? ''}
                  />
                )}
              />
            </div>
            <div className={styles['email-wrapper']}>
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
                    placeholder="koreatech 이메일(선택)"
                    value={field.value ?? ''}
                    message={fieldState.error ? { type: 'warning', content: MESSAGES.EMAIL.FORMAT } : null}
                  />
                )}
              />
              <div className={styles['email-wrapper__title']}>@koreatech.ac.kr</div>
            </div>
          </div>
        )}
      </div>

      <button type="submit" className={styles['next-button']} disabled={!isFormFilled || !isValid}>
        다음
      </button>
    </form>
  );
}

export default MobileStudentDetailStep;
