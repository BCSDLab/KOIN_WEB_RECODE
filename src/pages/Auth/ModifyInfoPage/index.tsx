/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  Suspense, useEffect, useImperativeHandle, useReducer, useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import showToast from 'utils/ts/showToast';
import { cn, sha256 } from '@bcsdlab/utils';
import useTokenState from 'utils/hooks/state/useTokenState';
import { Portal } from 'components/modal/Modal/PortalProvider';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useDeptList from 'pages/Auth/SignupPage/hooks/useDeptList';
import useNicknameDuplicateCheck from 'pages/Auth/SignupPage/hooks/useNicknameDuplicateCheck';
import { UserUpdateRequest, UserResponse, GeneralUserUpdateRequest } from 'api/auth/entity';
import { useUser } from 'utils/hooks/state/useUser';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from 'components/feedback/LoadingSpinner';
import ROUTES from 'static/routes';
import { REGEX, STORAGE_KEY, COMPLETION_STATUS } from 'static/auth';
import useUserInfoUpdate from 'utils/hooks/auth/useUserInfoUpdate';
import { usePhoneVerification } from 'pages/Auth/ModifyInfoPage/hooks/usePhoneVerification';
import ErrorIcon from 'assets/svg/Login/error.svg';
import CorrectIcon from 'assets/svg/Login/correct.svg';
import WarningIcon from 'assets/svg/Login/warning.svg';
import BlindIcon from 'assets/svg/blind-icon.svg';
import ShowIcon from 'assets/svg/show-icon.svg';
import ChevronLeft from 'assets/svg/Login/chevron-left.svg';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { useTokenStore } from 'utils/zustand/auth';
import { isStudentUser } from 'utils/ts/userTypeGuards';
import { useAuthentication } from 'utils/zustand/authentication';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import CustomSelector from 'pages/Auth/SignupPage/components/CustomSelector';
import UserDeleteModal from './components/UserDeleteModal';
import styles from './ModifyInfoPage.module.scss';
import useUserDelete from './hooks/useUserDelete';
import { ModifyFormValidationProvider, useValidationContext } from './hooks/useValidationContext';
import { passwordValidationReducer } from './reducers/passwordReducer';
import AuthenticateUserModal from './components/AuthenticateUserModal';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|;:'",.<>/?`~\\])[A-Za-z\d!@#$%^&*()\-_=+{}[\]|;:'",.<>/?`~\\]{8,}$/;
interface IFormType {
  [key: string]: {
    ref: HTMLInputElement | ICustomFormInput | null;
    validFunction?: (value: unknown, fieldRefs: { current: any }) => string | true;
  }
}

interface ICustomFormInput {
  value: unknown;
  valid: string | true;
  isVerified?: boolean;
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
  const isStudent = isStudentUser(userInfo);

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
    const baseFields = ['name', 'nickname', 'gender', 'phone-number', 'email'];
    const compareFields = isStudent ? [...baseFields, 'student-number'] : baseFields;

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
      const originalValue = (userInfo && isStudent) ? userInfo[userResponseField] : '';
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
  const [password, setPassword] = useState('');
  const [passwordConfirmValue, setPasswordConfirmValue] = useState('');
  const [visible, setVisible] = useState({
    password: false,
    passwordConfirm: false,
  });

  const [validationState, dispatchValidation] = useReducer(
    passwordValidationReducer,
    { message: '', isValid: false },
  );
  const { isValid, setIsValid } = useValidationContext();

  React.useImperativeHandle<ICustomFormInput | null, ICustomFormInput | null>(ref, () => {
    let valid: string | true = true;

    if (password === '' && passwordConfirmValue === '') {
      return { valid, value: password };
    }

    if (password !== passwordConfirmValue) {
      valid = '입력하신 비밀번호가 일치하지 않습니다.';
    } else if (password.length < 6 || password.length > 18) {
      valid = '비밀번호는 6자 이상 18자 이하여야 합니다.';
    } else if (password.includes(' ') || passwordConfirmValue.includes(' ')) {
      valid = '비밀번호에 공백이 포함될 수 없습니다.';
    } else if (!PASSWORD_REGEX.test(password)) {
      valid = '비밀번호는 영문자, 숫자, 특수문자를 각각 하나 이상 사용해야 합니다.';
    }
    return {
      valid,
      value: password,
    };
  }, [password, passwordConfirmValue]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPassword(value);

    if (!value) {
      dispatchValidation({ type: 'EMPTY' });
      setIsValid((prev) => ({ ...prev, isPasswordValid: false }));
      return;
    }

    if (value.length < 6 || value.length > 18) {
      dispatchValidation({ type: 'TOO_SHORT_OR_LONG' });
      setIsValid((prev) => ({ ...prev, isPasswordValid: false }));
      return;
    }

    if (value.includes(' ')) {
      dispatchValidation({ type: 'SPACING' });
      setIsValid((prev) => ({ ...prev, isPasswordValid: false }));
      return;
    }

    if (!PASSWORD_REGEX.test(value)) {
      dispatchValidation({ type: 'MISSING_COMPLEXITY' });
      setIsValid((prev) => ({ ...prev, isPasswordValid: false }));
      return;
    }

    if (passwordConfirmValue === '') {
      dispatchValidation({ type: 'CONFIRM_EMPTY' });
      setIsValid((prev) => ({ ...prev, isPasswordValid: false }));
      return;
    }

    if (value !== passwordConfirmValue) {
      dispatchValidation({ type: 'MISMATCH' });
      setIsValid((prev) => ({ ...prev, isPasswordValid: false }));
      return;
    }

    dispatchValidation({ type: 'VALID' });
    setIsValid((prev) => ({ ...prev, isPasswordValid: true, isFieldChanged: true }));
  };

  const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPasswordConfirmValue(value);

    if (password.length < 6 || password.length > 18) {
      dispatchValidation({ type: 'TOO_SHORT_OR_LONG' });
      setIsValid((prev) => ({ ...prev, isPasswordValid: false }));
      return;
    }

    if (value.includes(' ')) {
      dispatchValidation({ type: 'SPACING' });
      setIsValid((prev) => ({ ...prev, isPasswordValid: false }));
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      dispatchValidation({ type: 'MISSING_COMPLEXITY' });
      setIsValid((prev) => ({ ...prev, isPasswordValid: false }));
      return;
    }

    if (value === '') {
      dispatchValidation({ type: 'CONFIRM_EMPTY' });
      setIsValid((prev) => ({ ...prev, isPasswordValid: false }));
      return;
    }

    if (password !== value) {
      dispatchValidation({ type: 'MISMATCH' });
      setIsValid((prev) => ({ ...prev, isPasswordValid: false }));
      return;
    }

    dispatchValidation({ type: 'VALID' });
    setIsValid((prev) => ({ ...prev, isPasswordValid: true, isFieldChanged: true }));
  };

  return (
    <div className={styles['form-input__password']}>
      <div className={styles['form-input__label-wrapper']}>
        <label htmlFor="email" className={styles['form-input__label']}>
          비밀번호 변경
          <span className={styles['form-input__required']}>*</span>
        </label>
        <input
          className={cn({
            [styles['form-input']]: true,
            [styles['form-input--invalid']]: password.trim() !== '' && password !== passwordConfirmValue,
          })}
          type={visible.password ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="특수문자 포함 영어와 숫자 6~18자리로 입력해 주세요."
          onChange={handlePasswordChange}
          required={required}
          name={name}
          value={password}
        />
        <button
          type="button"
          className={cn({
            [styles['form-input__toggle']]: true,
            [styles['form-input__toggle--active']]: visible.password,
          })}
          onClick={() => setVisible((prev) => ({ ...prev, password: !prev.password }))}
          tabIndex={-1}
        >
          {visible.password ? <ShowIcon /> : <BlindIcon />}
        </button>
      </div>
      <div className={styles['form-input__label-wrapper']}>
        <label htmlFor="email" className={styles['form-input__label']}>
          비밀번호 확인
          <span className={styles['form-input__required']}>*</span>
        </label>
        <input
          className={styles['form-input']}
          type={visible.passwordConfirm ? 'text' : 'password'}
          onChange={handlePasswordConfirmChange}
          autoComplete="new-password"
          placeholder="비밀번호를 한번 더 입력해 주세요."
          value={passwordConfirmValue}
        />
        <button
          type="button"
          className={cn({
            [styles['form-input__toggle']]: true,
            [styles['form-input__toggle--active']]: visible.passwordConfirm,
          })}
          onClick={() => setVisible((prev) => (
            { ...prev, passwordConfirm: !prev.passwordConfirm }
          ))}
          tabIndex={-1}
        >
          {visible.passwordConfirm ? <ShowIcon /> : <BlindIcon />}
        </button>
        {!isValid.isPasswordValid && password.trim() !== '' && (
        <p className={cn({
          [styles['form-message']]: true,
          [styles['form-message--error']]: true,
        })}
        >
          <ErrorIcon />
          {validationState.message}
        </p>
        )}
        {isValid.isPasswordValid && (
        <p className={cn({
          [styles['form-message']]: true,
          [styles['form-message--success']]: true,
        })}
        >
          <CorrectIcon />
          비밀번호가 일치합니다.
        </p>
        )}
      </div>
    </div>
  );
});

const NicknameForm = React.forwardRef<ICustomFormInput | null, ICustomFormInputProps>((
  props,
  ref,
) => {
  const { data: userInfo } = useUser();
  const [currentNicknameValue, setCurrentNicknameValue] = React.useState<string>(userInfo?.nickname || '');
  const isMobile = useMediaQuery();
  const { setIsValid } = useValidationContext();

  const {
    status,
    currentCheckedNickname,
    changeTargetNickname,
  } = useNicknameDuplicateCheck();

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    setCurrentNicknameValue(newNickname);
    if (newNickname === '' && userInfo?.nickname) {
      setIsValid((prev) => ({ ...prev, isNicknameValid: true, isFieldChanged: true }));
      return;
    }

    if (newNickname === '') {
      setIsValid((prev) => ({ ...prev, isNicknameValid: false }));
      return;
    }

    if (!REGEX.NICKNAME.test(newNickname)) {
      setIsValid((prev) => ({ ...prev, isNicknameValid: false }));
    }
  };

  // 닉네임 중복 확인 버튼 클릭 핸들러
  const onClickNicknameDuplicateCheckButton = () => {
    if (REGEX.ADMIN_NICKNAME.test(currentNicknameValue)) {
      showToast('error', '사용할 수 없는 닉네임입니다.');
      setIsValid((prev) => ({ ...prev, isNicknameValid: false }));
      return;
    }
    if (currentNicknameValue === userInfo?.nickname) {
      showToast('info', '기존의 닉네임과 동일합니다.');
      return;
    }
    if (!REGEX.NICKNAME.test(currentNicknameValue)) {
      showToast('error', '닉네임은 10자 이하의 한글, 영문, 숫자만 사용할 수 있습니다.');
      setIsValid((prev) => ({ ...prev, isNicknameValid: false }));
      return;
    }
    changeTargetNickname(currentNicknameValue, {
      onSuccess: () => {
        setIsValid((prev) => ({ ...prev, isNicknameValid: true, isFieldChanged: true }));
      },
    });
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
      <div className={styles['form-input__label-wrapper']}>
        <label htmlFor="email" className={styles['form-input__label']}>
          닉네임(선택)
        </label>
        {isMobile ? (
          <div className={styles['form-input__row']}>
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
              disabled={currentNicknameValue === userInfo?.nickname || currentNicknameValue === ''}
            >
              중복확인
            </button>
          </div>
        ) : (
          <>
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
              disabled={currentNicknameValue === userInfo?.nickname || currentNicknameValue === ''}
            >
              중복확인
            </button>
          </>
        )}
      </div>
    </div>
  );
});

const MajorInput = React.forwardRef<ICustomFormInput, ICustomFormInputProps>((props, ref) => {
  const { data: userInfo } = useUser();
  const [studentNumber, setStudentNumber] = useState<string>(isStudentUser(userInfo) ? userInfo.student_number ?? '' : '');
  const { data: deptList } = useDeptList();
  const [major, setMajor] = useState<string | null>(
    isStudentUser(userInfo) ? userInfo?.major : null,
  );
  const deptOptionList = deptList.map((dept) => ({
    label: dept.name,
    value: dept.name,
  }));
  const { setIsValid } = useValidationContext();
  const isStudent = isStudentUser(userInfo);
  const isMobile = useMediaQuery();

  const handleChangeStudentId = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    setStudentNumber(target?.value ?? '');
    if (target.value.length >= 8 && target.value.length <= 10) {
      setIsValid((prev) => ({ ...prev, isStudentIdValid: true, isFieldChanged: true }));
    } else {
      setIsValid((prev) => ({ ...prev, isStudentIdValid: false }));
    }

    if (isStudentUser(userInfo) && target.value === userInfo?.student_number) {
      setIsValid((prev) => ({ ...prev, isFieldChanged: false, isStudentIdValid: false }));
    }
  };

  const handleChangeMajor = (event: { target: { value: string } }) => {
    const { target } = event;
    setMajor(target?.value ?? '');
    if (target.value) {
      setIsValid((prev) => ({ ...prev, isStudentMajorValid: true, isFieldChanged: true }));
    }
  };

  React.useImperativeHandle<ICustomFormInput | null, ICustomFormInput | null>(ref, () => {
    let valid: string | true = '오류가 발생했습니다';
    if (!/^\d+$/.test(studentNumber)) {
      valid = '학번은 숫자만 포함되어야 합니다.';
    } else if (studentNumber && (studentNumber.length < 8 || studentNumber.length > 10)) {
      valid = '학번은 8자리에서 10자리 사이여야 합니다.';
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

  useEffect(() => {
    if (isStudent) {
      if (studentNumber === userInfo?.student_number) {
        setIsValid((prev) => ({ ...prev, isStudentIdValid: true }));
      }
      if (major === userInfo?.major) {
        setIsValid((prev) => ({ ...prev, isStudentMajorValid: true }));
      }
    }
  }, []);
  return (
    <div>
      {isMobile ? (
        <>
          <div className={styles['form-input__label-wrapper']}>
            <label htmlFor="email" className={styles['form-input__label']}>
              학번
              <span className={styles['form-input__required']}>*</span>
            </label>
            <input
              className={styles['form-input']}
              placeholder="학번 (선택)"
              value={studentNumber}
              onChange={handleChangeStudentId}
              {...props}
            />
          </div>
          <div className={styles['form-input__label-wrapper']}>
            <label htmlFor="email" className={styles['form-input__label']}>
              학부
              <span className={styles['form-input__required']}>*</span>
            </label>
            <div className={styles['form-input__select']}>
              <CustomSelector
                options={deptOptionList}
                value={major}
                onChange={handleChangeMajor}
                placeholder="학부 (선택)"
              />
            </div>
          </div>
        </>
      ) : (
        <div className={styles['form-input__major-wrapper']}>
          <div className={styles['form-input__label-wrapper']}>
            <label htmlFor="email" className={styles['form-input__label']}>
              학부
              <span className={styles['form-input__required']}>*</span>
            </label>
            <div className={styles['form-input__select']}>
              <CustomSelector
                options={deptOptionList}
                value={major}
                onChange={handleChangeMajor}
                placeholder="학부를 선택해주세요."
              />
            </div>
          </div>
          <div className={styles['form-input__label-wrapper']}>
            <label htmlFor="email" className={styles['form-input__label']}>
              학번
              <span className={styles['form-input__required']}>*</span>
            </label>
            <input
              className={styles['form-input']}
              placeholder="학번 (선택)"
              value={studentNumber}
              onChange={handleChangeStudentId}
              {...props}
            />
          </div>
        </div>
      )}
    </div>
  );
});

const GenderInput = React.forwardRef((_, ref) => {
  const { data: userInfo } = useUser();
  const [
    selectedValue, setSelectedValue,
  ] = React.useState<string | null>(userInfo!.gender !== null ? String(userInfo?.gender) : null);
  const { setIsValid } = useValidationContext();

  useImperativeHandle(ref, () => ({
    value: selectedValue,
  }));

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(e.target.value);
    if (e.target.value !== String(userInfo?.gender)) {
      setIsValid((prev) => ({ ...prev, isGenderValid: true, isFieldChanged: true }));
    }
  };

  useEffect(() => {
    if (selectedValue === String(userInfo?.gender)) {
      setIsValid((prev) => ({ ...prev, isGenderValid: true }));
    }
  }, []);

  return (
    <div className={styles['form-input__label-wrapper']}>
      <label htmlFor="gender" className={styles['form-input__label']}>
        성별
        <span className={styles['form-input__required']}>*</span>
      </label>
      <div
        className={styles['form-input__radio']}
      >
        <div className={styles['form-input__radio-wrapper']}>
          <input
            type="radio"
            id="female"
            name="female"
            value="1"
            checked={selectedValue === '1'}
            onChange={handleGenderChange}
          />
          <label
            htmlFor="female"
            className={cn({
              [styles['form-input__label']]: true,
              [styles['form-input__label--gender']]: true,
            })}
          >
            여자
          </label>
        </div>
        <div className={styles['form-input__radio-wrapper']}>
          <input
            type="radio"
            id="male"
            name="male"
            value="0"
            checked={selectedValue === '0'}
            onChange={handleGenderChange}
          />
          <label
            htmlFor="male"
            className={cn({
              [styles['form-input__label']]: true,
              [styles['form-input__label--gender']]: true,
            })}
          >
            남자
          </label>
        </div>
      </div>
    </div>
  );
});

const PhoneInput = React.forwardRef((props, ref) => {
  const { data: userInfo } = useUser();
  const [phoneNumber, setPhoneNumber] = useState<string>(userInfo?.phone_number ?? '');
  const [codeNumber, setCodeNumber] = useState<string>('');
  const { setIsValid } = useValidationContext();
  const isMobile = useMediaQuery();

  const {
    checkPhoneNumber,
    verifyCode,
    phoneMessage,
    verificationMessage,
    isVerified,
    timeLeft,
    formattedTime,
    isRunning,
    sendSMS,
  } = usePhoneVerification(
    phoneNumber,
  );

  const { data } = sendSMS;

  useEffect(() => {
    if (phoneNumber === userInfo?.phone_number) {
      setIsValid((prev) => ({ ...prev, isPhoneValid: true }));
    }

    if (verifyCode.isSuccess) {
      setIsValid((prev) => ({ ...prev, isPhoneValid: true, isFieldChanged: true }));
    }
  }, [verifyCode.isSuccess, setIsValid, phoneNumber, userInfo?.phone_number]);

  useImperativeHandle(ref, () => {
    const value = phoneNumber.replace(/-/g, '');
    const valid = REGEX.PHONE_NUMBER.test(value)
      ? true
      : '전화번호 양식을 지켜주세요. (Ex: 01012345678)';
    const originalValue = (userInfo?.phone_number ?? '').replace(/-/g, '');

    if (value !== originalValue) {
      return { value, valid, isVerified };
    }
    return { value, valid };
  });

  const handleStartVerification = () => {
    if (phoneNumber !== userInfo?.phone_number) {
      checkPhoneNumber.mutate(phoneNumber);
    }
  };

  return (
    <>
      {isMobile && (
      <>
        <div className={styles['form-input__label-wrapper']}>
          <label htmlFor="phone" className={styles['form-input__label']}>
            휴대전화
            <span className={styles['form-input__required']}>*</span>
          </label>
          <div className={styles['form-input__row']}>
            <input
              className={styles['form-input']}
              type="text"
              autoComplete="tel"
              placeholder="전화번호 (Ex.01012345678)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              {...props}
            />
            <button
              type="button"
              className={cn({
                [styles.modify__button]: true,
                [styles['modify__button--phone']]: true,
                [styles['modify__button--active']]: phoneNumber !== userInfo?.phone_number,
              })}
              onClick={handleStartVerification}
              disabled={phoneNumber === userInfo?.phone_number}
            >
              {phoneMessage?.type === 'success' ? '인증번호 재발송' : '인증번호 발송'}
            </button>
          </div>
          {phoneMessage && (
          <p className={cn({
            [styles['form-message']]: true,
            [styles[`form-message--${phoneMessage.type}`]]: true,
          })}
          >
            {phoneMessage.type === 'success' && <CorrectIcon />}
            {phoneMessage.type === 'error' && <ErrorIcon />}
            {phoneMessage.type === 'warning' && <WarningIcon />}
            {phoneMessage.content}
            {phoneMessage.type === 'success' && (
              <span className={styles['form-message--count']}>
                남은 횟수
                {` (${data?.remaining_count}/${data?.total_count})`}
              </span>
            )}
          </p>
          )}
        </div>
        {phoneMessage?.type === 'success' && (
          <div className={styles['form-input__label-wrapper']}>
            <label htmlFor="code" className={styles['form-input__label']}>
              휴대전화 인증
              <span className={styles['form-input__required']}>*</span>
            </label>
            <div className={styles['form-input__row']}>
              <div className={styles['form-input__code-wrapper']}>
                <input
                  className={styles['form-input']}
                  type="text"
                  autoComplete="one-time-code"
                  placeholder="인증번호를 입력해주세요."
                  value={codeNumber}
                  onChange={(e) => setCodeNumber(e.target.value)}
                />
                {isRunning && (
                <p className={styles['form-message__timer']}>
                  {formattedTime}
                </p>
                )}
              </div>
              <button
                type="button"
                className={cn({
                  [styles.modify__button]: true,
                  [styles['modify__button--phone']]: true,
                  [styles['modify__button--active']]: codeNumber !== '',
                })}
                onClick={() => verifyCode.mutate(
                  { phone_number: phoneNumber, verification_code: codeNumber },
                )}
                disabled={codeNumber === '' || timeLeft === 0 || !isRunning}
              >
                인증하기
              </button>
            </div>
            {verificationMessage && (
            <p className={cn({
              [styles['form-message']]: true,
              [styles[`form-message--${verificationMessage.type}`]]: true,
            })}
            >
              {verificationMessage.type === 'success' && <CorrectIcon />}
              {verificationMessage.type === 'error' && <ErrorIcon />}
              {verificationMessage.type === 'warning' && <WarningIcon />}
              {verificationMessage.content}
            </p>
            )}
          </div>
        )}
      </>
      )}
      {!isMobile && (
        <>
          <div className={styles['form-input__label-wrapper']}>
            <label htmlFor="phone" className={styles['form-input__label']}>
              휴대전화 변경
              <span className={styles['form-input__required']}>*</span>
            </label>
            <input
              className={styles['form-input']}
              type="text"
              autoComplete="tel"
              placeholder="전화번호 (Ex.01012345678)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              {...props}
            />
            <button
              type="button"
              className={cn({
                [styles.modify__button]: true,
                [styles['modify__button--phone']]: true,
                [styles['modify__button--active']]: phoneNumber !== userInfo?.phone_number,
              })}
              onClick={handleStartVerification}
              disabled={phoneNumber === userInfo?.phone_number}
            >
              {phoneMessage?.type === 'success' ? '인증번호 재발송' : '인증번호 발송'}
            </button>
            {phoneMessage && (
            <p className={cn({
              [styles['form-message']]: true,
              [styles[`form-message--${phoneMessage.type}`]]: true,
            })}
            >
              {phoneMessage.type === 'success' && <CorrectIcon />}
              {phoneMessage.type === 'error' && <ErrorIcon />}
              {phoneMessage.type === 'warning' && <WarningIcon />}
              {phoneMessage.content}
              {phoneMessage.type === 'success' && (
              <span className={styles['form-message--count']}>
                남은 횟수
                {` (${data?.remaining_count}/${data?.total_count})`}
              </span>
              )}
            </p>
            )}
          </div>
          {phoneMessage?.type === 'success' && (
          <div className={styles['form-input__label-wrapper']}>
            <label htmlFor="code" className={styles['form-input__label']}>
              휴대전화 인증
              <span className={styles['form-input__required']}>*</span>
            </label>
            <div className={styles['form-input__code-wrapper']}>
              <input
                className={styles['form-input']}
                type="text"
                autoComplete="one-time-code"
                placeholder="인증번호를 입력해주세요."
                value={codeNumber}
                onChange={(e) => setCodeNumber(e.target.value)}
              />
              {isRunning && (
              <p className={styles['form-message__timer']}>
                {formattedTime}
              </p>
              )}
            </div>
            <button
              type="button"
              className={cn({
                [styles.modify__button]: true,
                [styles['modify__button--phone']]: true,
                [styles['modify__button--active']]: codeNumber !== '',
              })}
              onClick={() => verifyCode.mutate(
                { phone_number: phoneNumber, verification_code: codeNumber },
              )}
              disabled={codeNumber === '' || timeLeft === 0 || !isRunning}
            >
              인증하기
            </button>
            {verificationMessage && (
            <p className={cn({
              [styles['form-message']]: true,
              [styles[`form-message--${verificationMessage.type}`]]: true,
            })}
            >
              {verificationMessage.type === 'success' && <CorrectIcon />}
              {verificationMessage.type === 'error' && <ErrorIcon />}
              {verificationMessage.type === 'warning' && <WarningIcon />}
              {verificationMessage.content}
            </p>
            )}
          </div>
          )}
        </>
      )}
    </>
  );
});

const EmailForm = React.forwardRef<ICustomFormInput | null, ICustomFormInputProps>((props, ref) => {
  const { data: userInfo } = useUser();
  const { isValid, setIsValid } = useValidationContext();
  const { userType } = useTokenStore();

  const isStudent = userType === 'STUDENT';

  const initialEmail = userInfo?.email || '';
  const initialEmailValue = isStudent ? initialEmail.split('@')[0] : initialEmail;

  const [email, setEmail] = useState<string>(initialEmailValue);

  const fullEmail = isStudent ? `${email}@koreatech.ac.kr` : email;

  useImperativeHandle<ICustomFormInput | null, ICustomFormInput | null>(ref, () => {
    let valid: string | true = true;
    if (email !== '' && !REGEX.EMAIL.test(fullEmail)) {
      valid = '올바른 이메일 형식이 아닙니다.';
    }
    // 이메일이 비어있고, 변한 상태값은 없고, 기존에 이메일이 없는 경우
    if (email === '' && !userInfo?.email && !isValid.isFieldChanged) {
      valid = '이메일을 입력해주세요.';
    }

    // 이메일이 비어있고, 기존에 이메일이 있는 경우
    if (email === '' && userInfo?.email) {
      valid = true;
    }
    return {
      value: email === '' ? null : fullEmail,
      valid,
    };
  }, [fullEmail, email, userInfo?.email, isValid.isFieldChanged]);

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    const completeEmail = isStudent ? `${newEmail}@koreatech.ac.kr` : newEmail;

    if (newEmail === '' && userInfo?.email) {
      setIsValid((prev) => ({ ...prev, isEmailValid: true, isFieldChanged: true }));
    }

    if (newEmail === '' && !userInfo?.email && !isValid.isFieldChanged) {
      setIsValid((prev) => ({ ...prev, isEmailValid: false }));
    }

    if (completeEmail !== userInfo?.email && REGEX.EMAIL.test(completeEmail)) {
      setIsValid((prev) => ({ ...prev, isEmailValid: true, isFieldChanged: true }));
    }
  };

  return (
    <div className={styles['form-input__label-wrapper']}>
      <label htmlFor="email" className={styles['form-input__label']}>
        이메일(선택)
      </label>
      <div className={styles['form-input__email-wrapper']}>
        <input
          className={styles['form-input__email']}
          type={isStudent ? 'text' : 'email'}
          autoComplete="email"
          placeholder="이메일 (선택)"
          value={email}
          onChange={handleChangeEmail}
          {...props}
        />
        {userType === 'STUDENT' && <span className={styles['form-input__student-email']}>@koreatech.ac.kr</span>}
      </div>
    </div>
  );
});

const NameForm = React.forwardRef<ICustomFormInput | null, ICustomFormInputProps>((props, ref) => {
  const { data: userInfo } = useUser();
  const [name, setName] = useState<string>(userInfo?.name || '');
  const { setIsValid } = useValidationContext();

  useImperativeHandle<ICustomFormInput | null, ICustomFormInput | null>(ref, () => {
    let valid: string | true = true;
    if (name.trim() === '') {
      valid = '이름을 입력해주세요.';
    }
    if (/^[가-힣]+$/.test(name)) {
      if (REGEX.NAME_KR.test(name)) {
        valid = true;
      } else {
        valid = '한글 이름은 2자 이상 5자 이하로 입력해주세요.';
      }
    }
    if (/^[a-zA-Z]+$/.test(name)) {
      if (REGEX.NAME_EN.test(name)) {
        valid = true;
      } else {
        valid = '영문 이름은 2자 이상 30자 이하로 입력해주세요.';
      }
    }

    return {
      value: name,
      valid,
    };
  }, [name]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentName = e.target.value;
    setName(currentName);
    if (currentName.trim() === '') {
      setIsValid((prev) => ({ ...prev, isNameValid: false }));
      return;
    }

    if (/^[가-힣]+$/.test(currentName)) {
      if (REGEX.NAME_KR.test(currentName)) {
        setIsValid((prev) => ({ ...prev, isNameValid: true, isFieldChanged: true }));
      } else {
        setIsValid((prev) => ({ ...prev, isNameValid: false }));
      }
    }
    if (/^[a-zA-Z]+$/.test(name)) {
      if (REGEX.NAME_EN.test(name)) {
        setIsValid((prev) => ({ ...prev, isNameValid: true, isFieldChanged: true }));
      } else {
        setIsValid((prev) => ({ ...prev, isNameValid: false }));
      }
    }

    if (currentName !== userInfo?.name) {
      setIsValid((prev) => ({ ...prev, isNameValid: true, isFieldChanged: true }));
    }
  };

  useEffect(() => {
    if (name === userInfo?.name) {
      setIsValid((prev) => ({ ...prev, isNameValid: true }));
    }
  }, []);

  return (
    <div className={styles['form-input__label-wrapper']}>
      <label htmlFor="name" className={styles['form-input__label']}>
        이름
        <span className={styles['form-input__required']}>*</span>
      </label>
      <input
        className={styles['form-input']}
        type="text"
        autoComplete="name"
        placeholder="이름을 입력해주세요."
        value={name}
        onChange={handleNameChange}
        {...props}
      />
    </div>
  );
});

const useModifyInfoForm = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const token = useTokenState();
  const isMobile = useMediaQuery();
  const onSuccess = () => {
    localStorage.setItem(STORAGE_KEY.USER_INFO_COMPLETION, COMPLETION_STATUS.COMPLETED);
    navigate(ROUTES.Main());
    showToast('success', '성공적으로 정보를 수정하였습니다.');
    queryClient.invalidateQueries({ queryKey: ['userInfo', token] });
  };
  const { userType } = useTokenStore();
  const isStudent = userType === 'STUDENT';
  const { status, mutate } = useUserInfoUpdate(userType, { onSuccess });
  const submitForm: ISubmitForm = async (formValue) => {
    const payload: UserUpdateRequest & GeneralUserUpdateRequest = {
      name: formValue.name || undefined,
      nickname: formValue.nickname || undefined,
      gender: formValue.gender ?? undefined,
      phone_number: formValue['phone-number'] || undefined,
      email: formValue.email || null,
    };

    if (isStudent) {
      payload.major = formValue['student-number'].major || undefined;
      payload.student_number = formValue['student-number'].studentNumber || undefined;
    }

    if (!isMobile && formValue.password.trim().length > 0) {
      payload.password = await sha256(formValue.password);
    }
    mutate(payload);
  };
  return { submitForm, status };
};

function ModifyInfoDefaultPage() {
  const token = useTokenState();
  const navigate = useNavigate();
  const portalManager = useModalPortal();
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);

  const { status, submitForm } = useModifyInfoForm();
  const { data: userInfo } = useUser();
  const { register, onSubmit: onSubmitModifyForm } = useLightweightForm(submitForm);
  const { mutate: deleteUser } = useUserDelete();

  const isAuthenticated = useAuthentication();
  const isMobile = useMediaQuery();
  const isStudent = isStudentUser(userInfo);
  const { isFormValid } = useValidationContext(isStudent);

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

  useEffect(() => {
    if (!isAuthenticated) {
      openModal();
    }
  }, [isAuthenticated, openModal]);

  return (
    <div className={styles.container}>
      {isMobile ? (
        <div className={styles.header}>
          <button type="button" onClick={() => navigate(-1)} className={styles['header__go-back']} aria-label="뒤로가기">
            <ChevronLeft />
          </button>
          <span className={styles.header__title}>내 프로필</span>
          <button
            type="button"
            disabled={status === 'pending'}
            className={styles['header__delete-account-button']}
            onClick={onClickDeleteUser}
          >
            회원탈퇴
          </button>
        </div>
      ) : (
        <>
          <span className={styles.title}>정보 변경</span>
          <div className={styles.container__description}>
            <span className={styles['advice-character']}>*</span>
            <span className={styles.advice}>
              필수 입력사항
            </span>
          </div>
        </>
      )}
      {isMobile && (
        <span className={styles.modify__title}>기본 정보</span>
      )}
      <form className={styles.modify} onSubmit={onSubmitModifyForm}>
        <div className={styles['form-input__label-wrapper']}>
          <label htmlFor="email" className={styles['form-input__label']}>
            아이디
            <span className={styles['form-input__required']}>*</span>
          </label>
          <input
            className={styles['form-input']}
            type="text"
            readOnly
            disabled
            id="email"
            defaultValue={userInfo?.login_id}
          />
        </div>
        {!isMobile && (
        <p className={styles['form-input__description']}>
          계정 아이디는 변경하실 수 없습니다.
        </p>
        )}
        {isMobile ? (
          <>
            <NameForm {...register('name')} />
            <NicknameForm {...register('nickname')} />
            <PhoneInput {...register('phone-number')} />
            <EmailForm {...register('email')} />
            <GenderInput {...register('gender')} />
            {isStudent && (
              <>
                <span className={styles.modify__divider}>학생 정보</span>
                <MajorInput {...register('student-number')} />
              </>
            )}
          </>
        ) : (
          <>
            <NameForm {...register('name')} />
            <PasswordForm {...register('password')} />
            <GenderInput {...register('gender')} />
            <PhoneInput {...register('phone-number')} />
            {isStudent && <MajorInput {...register('student-number')} />}
            <EmailForm {...register('email')} />
            <NicknameForm {...register('nickname')} />
            <hr className={styles.divider} />
          </>
        )}
        <div className={styles.buttons__wrapper}>
          <button
            type="submit"
            disabled={status === 'pending' || !isFormValid}
            className={cn({
              [styles.modify__button]: true,
              [styles['modify__button--submit']]: true,
            })}
          >
            {isMobile ? '저장' : '정보수정'}
          </button>
          {!isMobile && (
          <button
            type="button"
            disabled={status === 'pending'}
            className={cn({
              [styles.modify__button]: true,
              [styles['modify__button--remove']]: true,
            })}
            onClick={onClickDeleteUser}
          >
            회원탈퇴
          </button>
          )}
        </div>
      </form>
      {isModalOpen && (
        <AuthenticateUserModal
          onClose={closeModal}
          disabledClose
        />
      )}
    </div>
  );
}

function ModifyInfoPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="40px" />}>
      <ModifyFormValidationProvider>
        <ModifyInfoDefaultPage />
      </ModifyFormValidationProvider>
    </Suspense>
  );
}

export default ModifyInfoPage;
