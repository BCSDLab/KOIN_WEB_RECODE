import React, { useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import showToast from 'utils/ts/showToast';
import cn from 'utils/ts/classnames';
import useBooleanState from 'utils/hooks/useBooleanState';
import { DeptListResponse, IDept } from 'api/dept/entity';
import sha256 from 'utils/ts/SHA-256';
import useNicknameDuplicateCheck from 'pages/Auth/SignupPage/hooks/useNicknameDuplicateCheck';
import useDeptList from 'pages/Auth/SignupPage/hooks/useDeptList';
import useTokenState from 'utils/hooks/useTokenState';
import useUserInfo from './hooks/useUserInfo';
import useUserInfoUpdate from './hooks/useUserInfoUpdate';
import styles from './ModifyInfoPage.module.scss';

const PASSWORD_REGEX = /(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[`₩~!@#$%<>^&*()\-=+_?<>:;"',.{}|[\]/\\]).+/g;

const PHONENUMBER_REGEX = /^\d{3}-\d{3,4}-\d{4}$/;

interface IFormType {
  [key: string]: {
    ref: HTMLInputElement | ICustomFormInput | null;
    validFunction?: (value: unknown, refCollection: { current: any }) => string | true;
  }
}

interface ICustomFormInput {
  value: unknown;
  valid: string | true;
}

interface IRegisterOption {
  validFunction?: (value: unknown, refCollection: { current: any }) => string | true;
  required?: boolean;
  defaultValue?: string | number;
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

const isRefICustomFormInput = (
  elementRef: HTMLInputElement | ICustomFormInput | null,
): elementRef is ICustomFormInput => (elementRef !== null
&& Object.prototype.hasOwnProperty.call(elementRef, 'valid'));

const useLightweightForm = (submitForm: ISubmitForm) => {
  const refCollection = React.useRef<IFormType>({});

  const register = (name: string, options: IRegisterOption = {}): RegisterReturn => {
    const ref = (elementRef: HTMLInputElement | ICustomFormInput | null) => {
      refCollection.current[name] = {
        ref: elementRef,
      };
      if (options.validFunction) {
        refCollection.current[name].validFunction = options.validFunction;
      }
      if (elementRef && (typeof options.defaultValue === 'string' || typeof options.defaultValue === 'number')) {
        // eslint-disable-next-line no-param-reassign
        elementRef.value = options.defaultValue.toString();
      }
      if (isRefICustomFormInput(elementRef) && options.defaultValue !== undefined) {
        // eslint-disable-next-line no-param-reassign
        elementRef.value = options.defaultValue;
      }
    };

    return {
      ref,
      required: options.required,
      name,
    };
  };
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const isCurrentValidEntries = Object.entries(refCollection.current)
      .map((refValue): [string, string | true] => {
        if (!refValue[1].ref) return [refValue[0], '오류가 발생했습니다.'];
        const isCurrentNameValid = isRefICustomFormInput(refValue[1].ref)
          ? refValue[1].ref.valid
          : refValue[1].validFunction?.(refValue[1].ref?.value ?? '', refCollection) ?? true;
        return [refValue[0], isCurrentNameValid];
      });
    const invalidFormEntry = isCurrentValidEntries
      .find((entry): entry is [string, string] => entry[1] !== true);
    if (!invalidFormEntry) {
      const formValue = Object.entries(refCollection?.current).map((nameValue) => {
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
        placeholder="비밀번호 (필수)"
        onChange={(e) => setPassword(e.target.value)}
        required={required}
        name={name}
      />
      <span className={styles.signup__advice}>
        비밀번호는 특수문자, 숫자를 포함해 6자 이상 18자 이하여야 합니다.
      </span>
      <input
        className={styles['form-input']}
        type="password"
        onChange={(e) => setPasswordConfirmValue(e.target.value)}
        autoComplete="new-password"
        placeholder="비밀번호 확인 (필수)"
      />
      <span className={styles.signup__advice}>
        비밀번호를 입력하지 않으면 기존 비밀번호를 유지합니다.
      </span>
    </>
  );
});

const NicknameForm = React.forwardRef<ICustomFormInput | null, ICustomFormInputProps>((
  props,
  ref,
) => {
  const nicknameElementRef = React.useRef<HTMLInputElement>(null);
  const [nicknameInputValue, setNicknameInputValue] = React.useState('');
  const {
    changeTargetNickname,
    status,
    currentCheckedNickname,
  } = useNicknameDuplicateCheck();
  useImperativeHandle<ICustomFormInput | null, ICustomFormInput | null>(
    ref,
    () => ({
      value: currentCheckedNickname,
      valid: nicknameInputValue === '' || (status === 'success' && nicknameInputValue === currentCheckedNickname) ? true : '닉네임 중복확인을 해주세요.',
    }),
    [currentCheckedNickname, status, nicknameInputValue],
  );
  const onClickNicknameDuplicateCheckButton = () => {
    changeTargetNickname(nicknameElementRef.current?.value ?? '');
  };
  const onChangeNicknameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    setNicknameInputValue(target.value);
  };
  return (
    <div
      className={cn({
        [styles.signup__row]: true,
        [styles['signup__row--nickname']]: true,
      })}
    >
      <input
        ref={nicknameElementRef}
        className={styles['form-input']}
        type="text"
        onChange={onChangeNicknameInput}
        autoComplete="nickname"
        placeholder="닉네임 (선택)"
        {...props}
      />
      <button
        type="button"
        className={cn({
          [styles.signup__button]: true,
          [styles['signup__button--nickname']]: true,
        })}
        onClick={onClickNicknameDuplicateCheckButton}
      >
        중복확인
      </button>
    </div>
  );
});

const MajorInput = React.forwardRef<ICustomFormInput, ICustomFormInputProps>((props, ref) => {
  const [studentNumber, setStudentNumber] = React.useState<string>('');
  const { data: deptList } = useDeptList();

  const onChangeMajorInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    setStudentNumber(target?.value ?? '');
  };
  const majorNumber = studentNumber && studentNumber.length >= 8 && studentNumber.length <= 10
    ? studentNumber?.slice(studentNumber.length - 5, studentNumber.length - 3)
    : '';
  const majorFromStudentNumber = studentNumber && studentNumber.length >= 8
  && studentNumber.length <= 10 && Array.isArray(deptList as DeptListResponse)
    // as unknown as ~를 써야 하는 이유: Response가 Array<IDept>로 주어진다.
    ? (deptList as unknown as Array<IDept>)?.find(
      (deptValue) => deptValue.dept_nums.find((deptNum) => (deptNum === majorNumber)),
    )?.name ?? '' : '';

  React.useImperativeHandle<ICustomFormInput | null, ICustomFormInput | null>(ref, () => {
    let valid: string | true = '오류가 발생했습니다';
    if (!studentNumber) {
      return {
        value: '',
        valid: true,
      };
    }
    const year = parseInt(studentNumber.slice(0, 4), 10);
    if (year < 1992 || year > new Date().getFullYear()) {
      valid = '올바른 입학년도가 아닙니다.';
    } else if (majorFromStudentNumber === '') {
      valid = '올바른 학부코드가 아닙니다.';
    } else {
      valid = true;
    }
    return {
      value: {
        studentNumber,
        major: majorFromStudentNumber,
      },
      valid,
    };
  }, [studentNumber, majorFromStudentNumber]);
  return (
    <>
      <input
        className={styles['form-input']}
        placeholder="학번 (선택)"
        value={studentNumber}
        onChange={onChangeMajorInput}
        {...props}
      />
      <input
        className={cn({
          [styles['form-input']]: true,
          [styles['form-input--half']]: true,
          [styles['form-input--disabled-value']]: majorFromStudentNumber !== '',
          [styles['form-input--flex-end']]: true,
        })}
        placeholder="학부(자동입력)"
        value={majorFromStudentNumber}
        disabled
      />
    </>
  );
});

const GENDER_TYPE = [
  { label: '남', value: 0 },
  { label: '여', value: 1 },
];

const GenderListbox = React.forwardRef<ICustomFormInput, ICustomFormInputProps>(({
  name,
  required,
}, ref) => {
  const [currentValue, setCurrentValue] = React.useState<number | null>(null);
  const [isOpenedPopup, openPopup, closePopup, triggerPopup] = useBooleanState(false);
  const onClickOption = (event: React.MouseEvent<HTMLLIElement>) => {
    const { currentTarget } = event;
    const value = currentTarget.getAttribute('data-value');
    setCurrentValue(value ? parseInt(value, 10) : null);
    closePopup();
  };
  const onBlurSelect = () => {
    closePopup();
  };
  const onKeyPressOption = (event: React.KeyboardEvent<HTMLLIElement>) => {
    const { key, currentTarget } = event;
    const value = currentTarget.getAttribute('data-value');
    switch (key) {
      case 'Enter':
        setCurrentValue(value ? parseInt(value, 10) : null);
        break;
      default:
        break;
    }
  };

  React.useImperativeHandle<ICustomFormInput | null, ICustomFormInput | null>(ref, () => {
    const requiredValidValue = (currentValue !== null ? true : '성별을 선택해주세요.');
    return {
      value: currentValue,
      valid: required ? requiredValidValue : true,
    };
  }, [currentValue, required]);

  return (
    <div
      className={cn({
        [styles.select]: true,
        [styles['select--flex-end']]: true,
      })}
      onMouseLeave={closePopup}
      onBlur={onBlurSelect}
    >
      <button
        type="button"
        onMouseOver={openPopup}
        onFocus={openPopup}
        onClick={triggerPopup}
        name={name}
        className={cn({
          [styles.select__trigger]: true,
          [styles['select__trigger--active']]: currentValue !== null,
        })}
      >
        {currentValue !== null ? GENDER_TYPE[currentValue].label : '성별'}
      </button>
      {isOpenedPopup && (
        <ul className={styles.select__content} role="listbox">
          {GENDER_TYPE.map((optionValue) => (
            <li
              className={styles.select__option}
              key={optionValue.value}
              role="option"
              aria-selected={optionValue.value === currentValue}
              data-value={optionValue.value}
              onClick={onClickOption}
              onKeyPress={onKeyPressOption}
            >
              {optionValue.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

const useModifyInfoForm = () => {
  const navigate = useNavigate();
  const onSuccess = () => {
    navigate('/');
  };
  const { status, mutate } = useUserInfoUpdate({ onSuccess });
  const submitForm: ISubmitForm = async (formValue) => {
    const payload = {
      password: await sha256(formValue.password),
      identity: 0,
      // 옵션
      name: formValue.name || undefined,
      nickname: formValue.nickname || undefined,
      gender: formValue.gender || undefined,
      major: formValue['student-number'].major || undefined,
      student_number: formValue['student-number'].studentNumber || undefined,
      phone_number: formValue['phone-number'] || undefined,
      is_graduated: false,
    };
    mutate(payload);
  };
  return { submitForm, status };
};

function ModifyInfoPage() {
  const { status, submitForm } = useModifyInfoForm();
  const token = useTokenState();
  const { userInfo } = useUserInfo(token);
  const { register, onSubmit: onSubmitSignupForm } = useLightweightForm(submitForm);
  return (
    <>
      <form className={styles.signup} onSubmit={onSubmitSignupForm}>
        <input
          className={styles['form-input']}
          type="text"
          readOnly
          disabled
        />
        <span className={styles.signup__advice}>
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
        <NicknameForm {...register('nickname', { defaultValue: userInfo?.nickname })} />
        <MajorInput {...register('student-number', { defaultValue: userInfo?.student_number })} />
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
        <GenderListbox {...register('gender', { defaultValue: userInfo?.gender })} />
        <button
          type="submit"
          disabled={status === 'loading'}
          className={cn({
            [styles.signup__button]: true,
            [styles['signup__button--flex-end']]: true,
            [styles['signup__button--block']]: true,
            [styles['signup__button--large-font']]: true,
          })}
        >
          정보수정
        </button>
        <button
          type="button"
          disabled={status === 'loading'}
          className={cn({
            [styles.signup__button]: true,
            [styles['signup__button--delete']]: true,
            [styles['signup__button--flex-end']]: true,
            [styles['signup__button--block']]: true,
            [styles['signup__button--large-font']]: true,
          })}
        >
          회원탈퇴
        </button>
      </form>
      <div className={styles.signup__section}>
        <span className={styles.signup__copyright}>
          COPYRIGHT ⓒ&nbsp;
          {new Date().getFullYear()}
          &nbsp;BY BCSDLab ALL RIGHTS RESERVED.
        </span>
      </div>
    </>
  );
}

export default ModifyInfoPage;
