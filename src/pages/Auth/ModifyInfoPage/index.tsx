import React, { Suspense, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import showToast from 'utils/ts/showToast';
import { cn, sha256 } from '@bcsdlab/utils';
import useTokenState from 'utils/hooks/state/useTokenState';
import { Portal } from 'components/common/Modal/PortalProvider';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useDeptList from 'pages/Auth/SignupPage/hooks/useDeptList';
import useNicknameDuplicateCheck from 'pages/Auth/SignupPage/hooks/useNicknameDuplicateCheck';
import { UserUpdateRequest, UserResponse } from 'api/auth/entity';
import { useUser } from 'utils/hooks/state/useUser';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from 'components/common/LoadingSpinner';
import ROUTES from 'static/routes';
import useUserInfoUpdate from 'utils/hooks/auth/useUserInfoUpdate';
import { Selector } from 'components/common/Selector';
import UserDeleteModal from './components/UserDeleteModal';
import styles from './ModifyInfoPage.module.scss';
import useUserDelete from './hooks/useUserDelete';

const PASSWORD_REGEX = /(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[`₩~!@#$%<>^&*()\-=+_?<>:;"',.{}|[\]/\\]).+/g;

const PHONENUMBER_REGEX = /^\d{3}-\d{3,4}-\d{4}$/;

interface IFormType {
  [key: string]: {
    ref: HTMLInputElement | ICustomFormInput | null;
    validFunction?: (value: unknown, fieldRefs: { current: any }) => string | true;
  }
}

interface ICustomFormInput {
  value: unknown;
  valid: string | true;
}

interface IRegisterOption {
  validFunction?: (value: unknown, fieldsRefs: { current: any }) => string | true;
  required?: boolean;
}

interface RegisterReturn {
  ref: (elementRef: HTMLInputElement | ICustomFormInput | null) => void;
  required?: boolean;
  name: string;
}

export interface ISubmitForm {
  (formValue: {
    [key: string]: any;
  }): void;
}

type UserResponseKeys = Omit<UserResponse, 'anonymous_nickname' | 'major'>;

interface MappedFields {
  [key: string]: keyof UserResponseKeys;
}

const isRefICustomFormInput = (
  elementRef: HTMLInputElement | ICustomFormInput | null,
): elementRef is ICustomFormInput => (elementRef !== null
  && Object.prototype.hasOwnProperty.call(elementRef, 'valid'));

const useLightweightForm = (submitForm: ISubmitForm) => {
  const fieldRefs = React.useRef<IFormType>({});
  const { data: userInfo } = useUser();

  const register = (name: string, options: IRegisterOption = {}): RegisterReturn => ({
    required: options.required,
    name,
    ref: (elementRef: HTMLInputElement | ICustomFormInput | null) => {
      fieldRefs.current[name] = {
        ref: elementRef,
      };
      if (options.validFunction) {
        fieldRefs.current[name].validFunction = options.validFunction;
      }
    },
  });
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    let isAnyFieldChanged = false;

    const mappedFields: MappedFields = {
      'phone-number': 'phone_number',
      'student-number': 'student_number',
    };
    const compareFields = ['name', 'nickname', 'gender', 'phone-number', 'student-number'];
    compareFields.forEach((field) => {
      if (!fieldRefs.current[field]) return;
      const fieldRef = fieldRefs.current[field].ref;
      let inputValue: any;
      const studentInfo = {
        studentNumber: '',
        major: '',
      };
      if (isRefICustomFormInput(fieldRef)) {
        inputValue = fieldRef.value ? fieldRef.value : null;
        if (field === 'gender' && fieldRef.value === 0) {
          inputValue = 0;
        }
      } else if (fieldRef !== null) {
        inputValue = fieldRef.value ? fieldRef.value : null;
      }
      // student-number의 경우 major와 studentNumber로 나뉘어져 있음
      if (field === 'student-number') {
        studentInfo.studentNumber = inputValue && typeof inputValue === 'object' && 'studentNumber' in inputValue ? inputValue.studentNumber : null;
        studentInfo.major = inputValue && typeof inputValue === 'object' && 'major' in inputValue ? inputValue.major : null;
      }
      const userResponseField = mappedFields[field] || field;
      const originalValue = userInfo ? userInfo[userResponseField] : '';
      if (inputValue !== originalValue
        || studentInfo.studentNumber !== originalValue
        || studentInfo.major !== originalValue) {
        isAnyFieldChanged = true;
      }
    });

    if (!isAnyFieldChanged && !fieldRefs.current.password?.ref?.value) {
      showToast('error', '변경된 정보가 없습니다.');
      return;
    }

    const isCurrentValidEntries = Object.entries(fieldRefs.current)
      .map((refValue): [string, string | true] => {
        if (!refValue[1].ref) return [refValue[0], '오류가 발생했습니다.'];
        const isCurrentNameValid = isRefICustomFormInput(refValue[1].ref)
          ? refValue[1].ref.valid
          : refValue[1].validFunction?.(refValue[1].ref?.value ?? '', fieldRefs) ?? true;

        return [refValue[0], isCurrentNameValid];
      });
    const invalidFormEntry = isCurrentValidEntries
      .find((entry): entry is [string, string] => entry[1] !== true);
    if (!invalidFormEntry) {
      const formValue = Object.entries(fieldRefs?.current).map((nameValue) => {
        if (isRefICustomFormInput(nameValue[1].ref) || nameValue[1].ref !== null) {
          return [nameValue[0], nameValue[1].ref.value];
        }
        return [nameValue[0], undefined];
      });
      submitForm(Object.fromEntries(formValue));
      return;
    }
    showToast('error', invalidFormEntry[1]);
  };
  return {
    register,
    onSubmit,
  };
};

type ICustomFormInputProps = Omit<RegisterReturn, 'ref'>;

const PasswordForm = React.forwardRef<ICustomFormInput | null, ICustomFormInputProps>(({
  name,
  required,
}, ref) => {
  const [password, setPassword] = React.useState('');
  const [passwordConfirmValue, setPasswordConfirmValue] = React.useState('');
  React.useImperativeHandle<ICustomFormInput | null, ICustomFormInput | null>(ref, () => {
    let valid: string | true = true;

    if (password === '' && passwordConfirmValue === '') {
      return { valid, value: password };
    }

    if (password !== passwordConfirmValue) {
      valid = '입력하신 비밀번호가 일치하지 않습니다.';
    } else if (password.length < 6 || password.length > 18) {
      valid = '비밀번호는 6자 이상 18자 이하여야 합니다.';
    } else if (!PASSWORD_REGEX.test(password)) {
      valid = '비밀번호는 영문자, 숫자, 특수문자를 각각 하나 이상 사용해야 합니다.';
    }
    return {
      valid,
      value: password,
    };
  }, [password, passwordConfirmValue]);
  return (
    <>
      <input
        className={cn({
          [styles['form-input']]: true,
          [styles['form-input--invalid']]: password.trim() !== '' && password !== passwordConfirmValue,
        })}
        type="password"
        autoComplete="new-password"
        placeholder="비밀번호 (선택)"
        onChange={(e) => setPassword(e.target.value)}
        required={required}
        name={name}
      />
      <span className={styles.modify__advice}>
        비밀번호는 특수문자, 숫자를 포함해 6자 이상 18자 이하여야 합니다.
      </span>
      <input
        className={styles['form-input']}
        type="password"
        onChange={(e) => setPasswordConfirmValue(e.target.value)}
        autoComplete="new-password"
        placeholder="비밀번호 확인 (선택)"
      />
      <span className={styles.modify__advice}>
        비밀번호를 입력하지 않으면 기존 비밀번호를 유지합니다.
      </span>
    </>
  );
});

const NicknameForm = React.forwardRef<ICustomFormInput | null, ICustomFormInputProps>((
  props,
  ref,
) => {
  const { data: userInfo } = useUser();
  const [currentNicknameValue, setCurrentNicknameValue] = React.useState<string>(userInfo?.nickname || '');

  const {
    changeTargetNickname,
    status,
    currentCheckedNickname,
  } = useNicknameDuplicateCheck();

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentNicknameValue(e.target.value);
  };

  // 닉네임 중복 확인 버튼 클릭 핸들러
  const onClickNicknameDuplicateCheckButton = () => {
    // 현재 입력된 닉네임과 기존 닉네임이 같다면 중복 검사를 수행하지 않습니다.
    if (currentNicknameValue === userInfo?.nickname) {
      showToast('info', '기존의 닉네임과 동일합니다.');
      return;
    }
    changeTargetNickname(currentNicknameValue);
  };

  useImperativeHandle<ICustomFormInput | null, ICustomFormInput | null>(
    ref,
    () => {
      // 닉네임 유효성 검사 로직
      const isNicknameVerified = currentNicknameValue === currentCheckedNickname;
      if (currentNicknameValue === '') {
        return {
          value: currentNicknameValue,
          valid: true,
        };
      }
      if (currentNicknameValue !== (userInfo?.nickname || '') && (status !== 'success' || !isNicknameVerified)) {
        return {
          value: currentNicknameValue,
          valid: '닉네임 중복확인을 해주세요.',
        };
      }
      return {
        value: currentNicknameValue,
        valid: true,
      };
    },
    [currentCheckedNickname, currentNicknameValue, status, userInfo?.nickname],
  );

  return (
    <div
      className={cn({
        [styles.modify__row]: true,
        [styles['modify__row--nickname']]: true,
      })}
    >
      <input
        onChange={handleNicknameChange}
        className={styles['form-input']}
        type="text"
        autoComplete="nickname"
        placeholder="닉네임 (선택)"
        defaultValue={userInfo?.nickname || ''}
        {...props}
      />
      <button
        type="button"
        className={cn({
          [styles.modify__button]: true,
          [styles['modify__button--nickname']]: true,
        })}
        onClick={onClickNicknameDuplicateCheckButton}
      >
        중복확인
      </button>
    </div>
  );
});

const MajorInput = React.forwardRef<ICustomFormInput, ICustomFormInputProps>((props, ref) => {
  const { data: userInfo } = useUser();
  const [studentNumber, setStudentNumber] = React.useState<string>(userInfo?.student_number || '');
  const { data: deptList } = useDeptList();
  const [major, setMajor] = React.useState<string | null>(userInfo?.major || null);
  const deptOptionList = deptList.map((dept) => ({
    label: dept.name,
    value: dept.name,
  }));

  const onChangeMajorInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    setStudentNumber(target?.value ?? '');
  };

  React.useImperativeHandle<ICustomFormInput | null, ICustomFormInput | null>(ref, () => {
    let valid: string | true = '오류가 발생했습니다';
    const year = parseInt(studentNumber.slice(0, 4), 10);
    if (year < 1992 || year > new Date().getFullYear()) {
      valid = '올바른 입학년도가 아닙니다.';
    } else if (studentNumber && studentNumber.length !== 10) {
      valid = '학번은 10자리여야 합니다.';
    } else {
      valid = true;
    }
    return {
      value: {
        studentNumber,
        major,
      },
      valid,
    };
  }, [studentNumber, major]);
  return (
    <>
      <input
        className={styles['form-input']}
        placeholder="학번 (선택)"
        value={studentNumber}
        onChange={onChangeMajorInput}
        {...props}
      />
      <div className={styles['form-input__select']}>
        <Selector
          options={deptOptionList}
          value={major}
          onChange={(event) => setMajor(event.target.value)}
          placeholder="학부 (선택)"
        />
      </div>
    </>
  );
});

const GenderSelectorWithRef = React.forwardRef((
  { options }: { options: { label: string; value:string }[] },
  ref,
) => {
  const { data: userInfo } = useUser();
  const [
    selectedValue, setSelectedValue,
  ] = React.useState<string | null>(userInfo!.gender !== null ? String(userInfo?.gender) : null);

  useImperativeHandle(ref, () => ({
    value: selectedValue,
  }));

  return (
    <div
      className={cn({
        [styles['form-input__select']]: true,
        [styles['form-input__select--flex-end']]: true,
      })}
      style={{ marginLeft: '6px' }}
    >
      <Selector
        options={options}
        value={String(selectedValue)}
        onChange={(event) => setSelectedValue(event.target.value)}
        placeholder="성별 (선택)"
      />
    </div>
  );
});

const useModifyInfoForm = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const token = useTokenState();
  const onSuccess = () => {
    navigate(ROUTES.Main());
    showToast('success', '성공적으로 정보를 수정하였습니다.');
    queryClient.invalidateQueries({ queryKey: ['userInfo', token] });
  };
  const { status, mutate } = useUserInfoUpdate({ onSuccess });
  const submitForm: ISubmitForm = async (formValue) => {
    const payload: UserUpdateRequest = {
      identity: 0,
      // 옵션
      name: formValue.name || undefined,
      nickname: formValue.nickname || undefined,
      gender: formValue.gender ?? undefined,
      major: formValue['student-number'].major || undefined,
      student_number: formValue['student-number'].studentNumber || undefined,
      phone_number: formValue['phone-number'] || undefined,
      is_graduated: false,
    };
    if ((formValue.password.trim()).length > 0) {
      payload.password = await sha256(formValue.password);
    }
    mutate(payload);
  };
  return { submitForm, status };
};

function ModifyInfoDefaultPage() {
  const { status, submitForm } = useModifyInfoForm();
  const token = useTokenState();
  const navigate = useNavigate();
  const { data: userInfo } = useUser();
  const { register, onSubmit: onSubmitModifyForm } = useLightweightForm(submitForm);
  const portalManager = useModalPortal();
  const { mutate: deleteUser } = useUserDelete();
  const onClickUserDeleteConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteUser(token);
    navigate(ROUTES.Main());
  };

  const onClickDeleteUser = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    portalManager.open((portalOption: Portal) => (
      <UserDeleteModal
        deleteUser={(event: React.MouseEvent<HTMLButtonElement>) => onClickUserDeleteConfirm(event)}
        onClose={portalOption.close}
      />
    ));
  };

  return (
    <>
      <form className={styles.modify} onSubmit={onSubmitModifyForm}>
        <input
          className={styles['form-input']}
          type="text"
          readOnly
          disabled
          defaultValue={userInfo?.email}
        />
        <span className={styles.modify__advice}>
          계정명은 변경하실 수 없습니다.
        </span>
        <PasswordForm {...register('password')} />
        <input
          className={styles['form-input']}
          type="text"
          autoComplete="name"
          defaultValue={userInfo?.name}
          placeholder="이름 (선택)"
          {...register('name')}
        />
        <NicknameForm {...register('nickname')} />
        <MajorInput {...register('student-number')} />
        <input
          className={styles['form-input']}
          type="text"
          autoComplete="name"
          defaultValue={userInfo?.phone_number}
          placeholder="전화번호 (Ex.010-0000-0000) (선택)"
          {...register('phone-number', {
            validFunction: (value) => {
              if (typeof value !== 'string') {
                return '오류가 발생했습니다';
              }
              if (!value) {
                return true;
              }
              if (!PHONENUMBER_REGEX.test(value)) {
                return '전화번호 양식을 지켜주세요. (Ex: 010-0000-0000)';
              }

              return true;
            },
          })}
        />
        <GenderSelectorWithRef {...register('gender')} options={[{ label: '남', value: '0' }, { label: '여', value: '1' }]} />
        <button
          type="submit"
          disabled={status === 'pending'}
          className={cn({
            [styles.modify__button]: true,
            [styles['modify__button--flex-end']]: true,
            [styles['modify__button--block']]: true,
            [styles['modify__button--large-font']]: true,
          })}
        >
          정보수정
        </button>
        <button
          type="button"
          disabled={status === 'pending'}
          className={cn({
            [styles.modify__button]: true,
            [styles['modify__button--delete']]: true,
            [styles['modify__button--flex-end']]: true,
            [styles['modify__button--block']]: true,
            [styles['modify__button--large-font']]: true,
          })}
          onClick={onClickDeleteUser}
        >
          회원탈퇴
        </button>
      </form>
      <div className={styles.modify__section}>
        <span className={styles.modify__copyright}>
          COPYRIGHT ⓒ&nbsp;
          {new Date().getFullYear()}
          &nbsp;BY BCSDLab ALL RIGHTS RESERVED.
        </span>
      </div>
    </>
  );
}

function ModifyInfoPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="40px" />}>
      <ModifyInfoDefaultPage />
    </Suspense>
  );
}

export default ModifyInfoPage;
