import React, { Suspense, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import showToast from 'utils/ts/showToast';
import { cn, sha256 } from '@bcsdlab/utils';
import ChervronUpDown from 'assets/svg/chervron-up-down.svg';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { koin, privacy } from 'static/terms';
import useLogger from 'utils/hooks/analytics/useLogger';
import LoadingSpinner from 'components/common/LoadingSpinner';
import Listbox from 'components/TimetablePage/Listbox';
import ROUTES from 'static/routes';
import styles from './SignupPage.module.scss';
import useNicknameDuplicateCheck from './hooks/useNicknameDuplicateCheck';
import useDeptList from './hooks/useDeptList';
import useSignup from './hooks/useSignup';

const PASSWORD_REGEX = /(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[`₩~!@#$%<>^&*()\-=+_?<>:;"',.{}|[\]/\\]).+/;

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

  const register = (name: string, options: IRegisterOption = {}): RegisterReturn => ({
    required: options.required,
    name,
    ref: (elementRef: HTMLInputElement | ICustomFormInput | null) => {
      refCollection.current[name] = {
        ref: elementRef,
      };
      if (options.validFunction) {
        refCollection.current[name].validFunction = options.validFunction;
      }
    },
  });
  const watch = (name?: string) => {
    if (name) {
      return refCollection.current[name]?.ref?.value ?? undefined;
    }
    return Object.fromEntries(
      Object.entries(refCollection.current).map(([key, refObj]) => [
        key,
        refObj.ref?.value ?? undefined,
      ]),
    );
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
    watch,
  };
};

type ICustomFormInputProps = Omit<RegisterReturn, 'ref'>;

const PasswordForm = React.forwardRef<ICustomFormInput | null, ICustomFormInputProps>(({
  name,
  required,
}, ref) => {
  const [password, setPassword] = React.useState('');
  const [passwordConfirmValue, setPasswordConfirmValue] = React.useState('');
  const [isPasswordValid, setIsPasswordValid] = React.useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordValidCheck = () => {
    setIsPasswordValid(PASSWORD_REGEX.test(password));
  };

  React.useImperativeHandle<ICustomFormInput | null, ICustomFormInput | null>(ref, () => {
    let valid: string | true = true;
    if (password !== passwordConfirmValue) {
      valid = '입력하신 비밀번호가 일치하지 않습니다.';
    } else if (password.length < 6 || password.length > 18) {
      valid = '비밀번호는 6자 이상 18자 이하여야 합니다.';
    } else if (!isPasswordValid) {
      valid = '비밀번호는 영문자, 숫자, 특수문자를 각각 하나 이상 사용해야 합니다.';
    }
    return {
      valid,
      value: password,
    };
  }, [password, passwordConfirmValue, isPasswordValid]);
  return (
    <>
      <input
        className={cn({
          [styles['form-input']]: true,
          [styles['form-input--invalid']]: password.trim() !== '' && !isPasswordValid,
        })}
        type="password"
        autoComplete="new-password"
        placeholder="비밀번호 (필수)"
        onChange={handlePasswordChange}
        onBlur={handlePasswordValidCheck}
        required={required}
        name={name}
      />
      <span className={styles.signup__advice}>
        비밀번호는 특수문자, 숫자를 포함해 6자 이상 18자 이하여야 합니다.
      </span>
      <input
        className={cn({
          [styles['form-input']]: true,
          [styles['form-input--invalid']]: passwordConfirmValue.trim() !== '' && password !== passwordConfirmValue,
        })}
        type="password"
        onChange={(e) => setPasswordConfirmValue(e.target.value)}
        autoComplete="new-password"
        placeholder="비밀번호 확인 (필수)"
      />
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
  const deptOptionList = deptList.map((dept) => ({
    label: dept.name,
    value: dept.name,
  }));
  const [major, setMajor] = React.useState<string | null>(null);

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
        <Listbox
          list={deptOptionList}
          value={major}
          onChange={({ target }) => setMajor(target.value)}
        />
      </div>
    </>
  );
});
/* TODO: 코인 디자인 시스템 중 Listbox(Select)에 해당되므로 만든다면 다음을 참고하세요.
 * https://headlessui.com/react/listbox
 * https://react-spectrum.adobe.com/react-aria/useSelect.html
 * 2022.09.05 현재 디자인 시스템 없음, Listbox 재사용하는 곳이 많지 않음을 이유로 만들지 않았습니다.
 */

const GENDER_TYPE = [
  { label: '남', value: 0 },
  { label: '여', value: 1 },
];

const GenderListbox = React.forwardRef<ICustomFormInput, ICustomFormInputProps>(({
  name,
  required,
}, ref) => {
  const [currentValue, setCurrentValue] = React.useState<number | null>(null);
  const [isOpenedPopup,, closePopup, triggerPopup] = useBooleanState(false);
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
      onBlur={onBlurSelect}
    >
      <button
        type="button"
        onClick={triggerPopup}
        name={name}
        className={cn({
          [styles.select__trigger]: true,
          [styles['select__trigger--active']]: currentValue !== null,
        })}
      >
        {currentValue !== null ? GENDER_TYPE[currentValue].label : '성별'}
        <ChervronUpDown />
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
              onMouseDown={onClickOption}
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

const TermsCheckboxes = React.forwardRef<ICustomFormInput | null, ICustomFormInputProps>(({
  name,
  required,
}, ref) => {
  const [terms, setTerms] = React.useState({
    privacy: false,
    usage: false,
  });
  const onChangeAllTerms = () => {
    setTerms((prevValue) => ({
      privacy: !(prevValue.privacy && prevValue.usage),
      usage: !(prevValue.privacy && prevValue.usage),
    }));
  };
  const onChangePrivacyTerm = () => {
    setTerms((prevValue) => ({
      ...prevValue,
      privacy: !(prevValue.privacy),
    }));
  };
  const onChangeUsageTerm = () => {
    setTerms((prevValue) => ({
      ...prevValue,
      usage: !(prevValue.usage),
    }));
  };
  React.useImperativeHandle<ICustomFormInput | null, ICustomFormInput | null>(ref, () => {
    const requiredValidValue = (terms.privacy && terms.usage) ? true : '이용 약관에 모두 동의해주세요.';
    return {
      value: terms,
      valid: required ? requiredValidValue : true,
    };
  }, [terms, required]);

  return (
    <div
      className={cn({
        [styles.signup__section]: true,
        [styles['signup__section--flex-end']]: true,
      })}
    >
      <label
        className={cn({
          [styles['signup__checkbox-label']]: true,
          [styles['signup__checkbox-label--large']]: true,
        })}
      >
        <input
          id="terms-all"
          className={styles.signup__checkbox}
          type="checkbox"
          checked={terms.privacy && terms.usage}
          onChange={onChangeAllTerms}
          name={name}
        />
        위 이용약관에 모두 동의합니다.
      </label>
      <label
        className={styles['signup__checkbox-label']}
      >
        <input
          id="terms-privacy"
          className={styles.signup__checkbox}
          type="checkbox"
          checked={terms.privacy}
          onChange={onChangePrivacyTerm}
        />
        개인정보 이용약관에 동의합니다.
      </label>
      <label
        className={styles['signup__checkbox-label']}
      >
        <input
          id="terms-usage"
          className={styles.signup__checkbox}
          type="checkbox"
          checked={terms.usage}
          onChange={onChangeUsageTerm}
        />
        코인 이용약관에 동의합니다.
      </label>
    </div>
  );
});

const useSignupForm = () => {
  const navigate = useNavigate();
  const onSuccess = () => {
    navigate(ROUTES.Main());
  };
  const { status, mutate } = useSignup({ onSuccess });
  const submitForm: ISubmitForm = async (formValue) => {
    const payload = {
      // 필수정보
      email: `${formValue.id?.trim()}@koreatech.ac.kr`,
      password: await sha256(formValue.password),
      // 옵션
      name: formValue.name || undefined,
      nickname: formValue.nickname || undefined,
      gender: formValue.gender ?? undefined,
      major: formValue['student-number'].major || undefined,
      student_number: formValue['student-number'].studentNumber || undefined,
      phone_number: formValue['phone-number'] || undefined,
      is_graduated: false,
    };
    mutate(payload);
  };
  return { submitForm, status };
};

function SignupDefaultPage() {
  const { status, submitForm } = useSignupForm();
  const { register, onSubmit: onSubmitSignupForm } = useLightweightForm(submitForm);
  const logger = useLogger();

  return (
    <>
      <div>
        <div className={styles.term__title}>개인정보 이용약관</div>
        <textarea className={styles.term__content} defaultValue={privacy} readOnly />
        <div className={styles.term__title}>코인 이용약관</div>
        <textarea className={styles.term__content} defaultValue={koin} readOnly />
        <TermsCheckboxes {...register('terms', { required: true })} />
      </div>
      <form className={styles.signup} onSubmit={onSubmitSignupForm}>
        <input
          className={styles['form-input']}
          type="text"
          autoComplete="username"
          placeholder="아우누리 아이디를 입력해주세요. (필수)"
          {...register('id', {
            required: true,
            validFunction: (value) => {
              if (typeof value !== 'string') {
                return '오류가 발생했습니다';
              }
              if (!value) {
                return '필수정보는 반드시 입력해야 합니다.';
              }
              if (value.indexOf('@koreatech.ac.kr') !== -1) {
                return '계정명은 @koreatech.ac.kr을 빼고 입력해주세요.';
              }
              if (value.indexOf('@') !== -1) {
                return '이메일의 아이디 부분만 입력해주세요.';
              }
              return true;
            },
          })}
        />
        <span className={styles.signup__advice}>
          @koreatech.ac.kr은 입력하지 않으셔도 됩니다.
        </span>
        <PasswordForm {...register('password')} />
        <input
          className={styles['form-input']}
          type="text"
          autoComplete="name"
          placeholder="이름 (선택)"
          {...register('name')}
        />
        <NicknameForm {...register('nickname')} />
        <MajorInput {...register('student-number')} />
        <input
          className={styles['form-input']}
          type="text"
          autoComplete="name"
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
        <GenderListbox {...register('gender')} />
        <button
          type="submit"
          disabled={status === 'pending'}
          className={cn({
            [styles.signup__button]: true,
            [styles['signup__button--flex-end']]: true,
            [styles['signup__button--block']]: true,
            [styles['signup__button--large-font']]: true,
          })}
          onClick={() => {
            logger.actionEventClick({
              actionTitle: 'USER',
              event_label: 'complete_sign_up',
              value: '회원가입 완료',
            });
          }}
        >
          회원가입
        </button>
      </form>
      <span className={styles.signup__copyright}>
        COPYRIGHT ⓒ&nbsp;
        {new Date().getFullYear()}
        &nbsp;BY BCSDLab ALL RIGHTS RESERVED.
      </span>
    </>
  );
}

function SignupPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="50px" />}>
      <SignupDefaultPage />
    </Suspense>
  );
}

export default SignupPage;
