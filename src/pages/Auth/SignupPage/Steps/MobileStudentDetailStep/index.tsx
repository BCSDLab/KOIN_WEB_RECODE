/* eslint-disable no-restricted-imports */
import { isKoinError } from '@bcsdlab/koin';
import { useMutation } from '@tanstack/react-query';
import { nicknameDuplicateCheck } from 'api/auth';
import { useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import CustomInput, { type InputMessage } from '../../components/CustomInput';
import CustomSelector from '../../components/CustomSelector';
import useDeptList from '../../hooks/useDeptList';
import styles from './MobileStudentDetailStep.module.scss';

const MESSAGES = {
  PASSWORD_FORMAT: '올바른 비밀번호 양식이 아닙니다. 다시 입력해 주세요.',
  PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',
  PASSWORD_MATCH: '비밀번호가 일치합니다.',

  NICKNAME_DUPLICATED: '중복된 닉네임입니다. 다시 입력해 주세요.',
  NICKNAME_AVAILABLE: '사용 가능한 닉네임입니다.',
};

const REGEX = {
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`[\]{}|\\:;"'<>,.?/])[A-Za-z\d!@#$%^&*()_\-+=~`[\]{}|\\:;"'<>,.?/]{6,18}$/,
  NICKNAME: /^[가-힣a-zA-Z0-9]{1,10}$/,
};

interface MobileVerificationProps {
  onNext: () => void;
}

function MobileStudentDetailStep({ onNext }: MobileVerificationProps) {
  const { control, getValues } = useFormContext();
  const phoneNumber = getValues('phone_number');
  const nickname = (useWatch({ control, name: 'nickname' }) ?? '') as string;

  const [major, setMajor] = useState<string | null>(null);
  const [phoneMessage, setPhoneMessage] = useState<InputMessage | null>(null);

  const { data: deptList } = useDeptList();
  const deptOptionList = deptList.map((dept) => ({
    label: dept.name,
    value: dept.name,
  }));

  const { mutate: checkNickname } = useMutation({
    mutationFn: nicknameDuplicateCheck,
    onSuccess: () => {
      setPhoneMessage({ type: 'success', content: MESSAGES.NICKNAME_AVAILABLE });
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) {
          // 형식 아직 안나옴 (이후추가)
          // setPhoneMessage({ type: 'warning', content: MESSAGES });
        }

        if (err.status === 409) {
          setPhoneMessage({ type: 'error', content: MESSAGES.NICKNAME_DUPLICATED });
        }
      }
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles['form-container']}>
        <div className={styles.wrapper}>
          <h1 className={styles.wrapper__header}>아이디 (전화번호)</h1>
          <Controller
            name="number"
            control={control}
            defaultValue={phoneNumber}
            render={({ field }) => (
              <CustomInput {...field} disabled />
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
                value: REGEX.PASSWORD,
              }}
              render={({ field, fieldState }) => (
                <CustomInput
                  {...field}
                  placeholder="특수문자 포함 영어와 숫자 6~18자리로 입력해주세요."
                  type="password"
                  isVisibleButton
                  message={fieldState.error ? { type: 'error', content: MESSAGES.PASSWORD_FORMAT } : null}
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
                  message={fieldState.error
                    ? { type: 'error', content: MESSAGES.PASSWORD_MISMATCH }
                    : { type: 'success', content: MESSAGES.PASSWORD_MATCH }}
                />
              )}
            />

          </div>
        </div>
        <div className={styles.wrapper}>
          <h1 className={styles.wrapper__header}>학부와 학번을 알려주세요.</h1>
          <CustomSelector
            options={deptOptionList}
            value={major}
            onChange={(event) => setMajor(event.target.value)}
            placeholder="학부를 선택해주세요."
          />
          <Controller
            name="student_number"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <CustomInput {...field} placeholder="학번을 입력해주세요." isDelete />
            )}
          />
          <div className={styles['input-wrapper']}>
            <Controller
              name="nickname"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                value: REGEX.NICKNAME,
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
                />
              )}
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className={styles['next-button']}
      >
        다음
      </button>
    </div>
  );
}

export default MobileStudentDetailStep;
