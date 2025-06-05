import React, {
  Suspense, useEffect, useImperativeHandle, useState,
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
import { REGEX } from 'static/auth';
import useUserInfoUpdate from 'utils/hooks/auth/useUserInfoUpdate';
import { Selector } from 'components/ui/Selector';
import { usePhoneVerification } from 'pages/Auth/ModifyInfoPage/hooks/usePhoneVerification';
import ErrorIcon from 'assets/svg/Login/error.svg';
import CorrectIcon from 'assets/svg/Login/correct.svg';
import WarningIcon from 'assets/svg/Login/warning.svg';
import BlindIcon from 'assets/svg/blind-icon.svg';
import ShowIcon from 'assets/svg/show-icon.svg';
import { useTokenStore } from 'utils/zustand/auth';
import { isStudentUser } from 'utils/ts/userTypeGuards';
import UserDeleteModal from './components/UserDeleteModal';
import styles from './ModifyInfoPage.module.scss';
import useUserDelete from './hooks/useUserDelete';
import { ModifyFormValidationProvider, useValidationContext } from './hooks/useValidationContext';

const PASSWORD_REGEX = /(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[`₩~!@#$%<>^&*()\-=+_?<>:;"',.{}|[\]/\\]).+/g;

const PHONENUMBER_REGEX = /^\d{3}\d{3,4}\d{4}$/;

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
  const [validationMessage, setValidationMessage] = useState<string>('');
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
    } else if (!PASSWORD_REGEX.test(password)) {
      valid = '비밀번호는 영문자, 숫자, 특수문자를 각각 하나 이상 사용해야 합니다.';
    }
    return {
      valid,
      value: password,
    };
  }, [password, passwordConfirmValue]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    const currentPassword = e.target.value;
    if (currentPassword !== '' && currentPassword.length >= 6 && currentPassword.length <= 18) {
      setValidationMessage('비밀번호는 영문자, 숫자, 특수문자를 각각 하나 이상 사용해야 합니다.');
      setIsValid((prev) => ({ ...prev, isPasswordValid: false }));
    } else if (currentPassword.length < 6 || currentPassword.length > 18) {
      setValidationMessage('비밀번호는 6자 이상 18자 이하여야 합니다.');
      setIsValid((prev) => ({ ...prev, isPasswordValid: false }));
    }
  };

  const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentPasswordConfirmValue = e.target.value;
    setPasswordConfirmValue(currentPasswordConfirmValue);
    if (password.trim() !== '' && password === currentPasswordConfirmValue) {
      setIsValid((prev) => ({ ...prev, isPasswordValid: true }));
    } else {
      setValidationMessage('입력하신 비밀번호가 일치하지 않습니다.');
      setIsValid((prev) => ({ ...prev, isPasswordValid: false }));
    }
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
          {validationMessage}
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

  const {
    changeTargetNickname,
    status,
    currentCheckedNickname,
  } = useNicknameDuplicateCheck();

  const { setIsValid } = useValidationContext();

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
    setIsValid((prev) => ({ ...prev, isNicknameValid: true }));
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
          disabled={currentNicknameValue === userInfo?.nickname}
        >
          중복확인
        </button>
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

  const onChangeMajorInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    setStudentNumber(target?.value ?? '');
    if (target.value.length === 10) {
      setIsValid((prev) => ({ ...prev, isStudentInfoValid: true }));
    }
  };

  const handleChangeMajor = (event: { target: { value: string } }) => {
    const { target } = event;
    setMajor(target?.value ?? '');
    if (target.value) {
      setIsValid((prev) => ({ ...prev, isStudentMajorValid: true }));
    }
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
      <div className={styles['form-input__label-wrapper']}>
        <label htmlFor="email" className={styles['form-input__label']}>
          학부
          <span className={styles['form-input__required']}>*</span>
        </label>
        <div className={styles['form-input__select']}>
          <Selector
            options={deptOptionList}
            value={major}
            onChange={handleChangeMajor}
            placeholder="학부 (선택)"
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
          onChange={onChangeMajorInput}
          {...props}
        />
      </div>
    </>
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

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    setSelectedValue(target.value);
    if (target.value !== userInfo?.gender?.toString()) {
      setIsValid((prev) => ({ ...prev, isGenderValid: true }));
    }
  };

  return (
    <div className={styles['form-input__label-wrapper']}>
      <label htmlFor="email" className={styles['form-input__label']}>
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
          <label htmlFor="female" className={styles['form-input__label']}>
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
          <label htmlFor="male" className={styles['form-input__label']}>
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

  const {
    checkPhoneNumber,
    verifyCode,
    phoneMessage,
    verificationMessage,
    smsSendCount,
    isVerified,
    timeLeft,
    formattedTime,
    isRunning,
  } = usePhoneVerification(
    phoneNumber,
  );

  useEffect(() => {
    if (verifyCode.isSuccess) {
      setIsValid((prev) => ({ ...prev, isPhoneNumberValid: true }));
    }
  }, [verifyCode.isSuccess, setIsValid]);

  useImperativeHandle(ref, () => {
    const value = phoneNumber.replace(/-/g, '');
    const valid = PHONENUMBER_REGEX.test(value)
      ? true
      : '전화번호 양식을 지켜주세요. (Ex: 010-0000-0000)';
    const originalValue = (userInfo?.phone_number ?? '').replace(/-/g, '');

    if (value !== originalValue) {
      return { value, valid, isVerified };
    }
    return { value, valid };
  });

  const handleStartVerification = () => {
    if (phoneNumber !== userInfo?.phone_number.replace(/-/g, '')) {
      checkPhoneNumber.mutate(phoneNumber);
    }
  };

  return (
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
          placeholder="전화번호 (Ex.010-0000-0000)"
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
          인증번호 발송
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
          <span className={styles['form-message--count']}>
            남은 횟수:
            {`${smsSendCount}/5`}
          </span>
        </p>
        )}
      </div>
      <div className={styles['form-input__label-wrapper']}>
        <label htmlFor="code" className={styles['form-input__label']}>
          휴대전화 인증
          <span className={styles['form-input__required']}>*</span>
        </label>
        <input
          className={styles['form-input']}
          type="text"
          autoComplete="one-time-code"
          placeholder="인증번호를 입력해주세요."
          value={codeNumber}
          onChange={(e) => setCodeNumber(e.target.value)}
        />
        {isRunning && (
        <p className={styles['form-message--timer']}>
          {formattedTime}
        </p>
        )}
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
    </>
  );
});

const EmailForm = React.forwardRef<ICustomFormInput | null, ICustomFormInputProps>((props, ref) => {
  const { data: userInfo } = useUser();
  const { setIsValid } = useValidationContext();
  const { userType } = useTokenStore();

  const isStudent = userType === 'STUDENT';

  const initialEmail = userInfo?.email || '';
  const initialEmailValue = isStudent ? initialEmail.split('@')[0] : initialEmail;

  const [email, setEmail] = useState<string>(initialEmailValue);

  const fullEmail = isStudent ? `${email}@koreatech.ac.kr` : email;

  useImperativeHandle<ICustomFormInput | null, ICustomFormInput | null>(ref, () => ({
    value: fullEmail,
    valid: true,
  }), [fullEmail]);

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    const newEmail = isStudent ? input.replace(/@.*/, '') : input;
    setEmail(newEmail);

    const completeEmail = isStudent ? `${newEmail}@koreatech.ac.kr` : newEmail;

    if (completeEmail !== userInfo?.email && REGEX.EMAIL.test(completeEmail)) {
      setIsValid((prev) => ({ ...prev, isEmailValid: true }));
    }
  };

  return (
    <div className={styles['form-input__label-wrapper']}>
      <label htmlFor="email" className={styles['form-input__label']}>
        이메일(선택)
      </label>
      <div className={styles['form-input__wrapper']}>
        <input
          className={styles['form-input']}
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

const useModifyInfoForm = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const token = useTokenState();
  const onSuccess = () => {
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
      email: formValue.email || undefined,
    };

    if (isStudent) {
      payload.major = formValue['student-number'].major || undefined;
      payload.student_number = formValue['student-number'].studentNumber || undefined;

      if ((formValue.password.trim()).length > 0) {
        payload.password = await sha256(formValue.password);
      }
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
  const { isValid } = useValidationContext();
  const isStudent = isStudentUser(userInfo);

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
    <div className={styles.container}>
      <span className={styles.title}>정보 변경</span>
      <div className={styles.container__description}>
        <span className={styles['advice-character']}>*</span>
        <span className={styles.advice}>
          필수 입력사항
        </span>
      </div>
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
            defaultValue={isStudent ? userInfo?.email : userInfo?.login_id}
          />
        </div>
        <p className={styles['form-input__description']}>
          계정 아이디는 변경하실 수 없습니다.
        </p>
        <PasswordForm {...register('password')} />
        <GenderInput {...register('gender')} />
        <PhoneInput {...register('phone-number')} />
        {isStudent && <MajorInput {...register('student-number')} />}
        <EmailForm {...register('email')} />
        <NicknameForm {...register('nickname')} />
        <hr className={styles.divider} />
        <div className={styles.buttons__wrapper}>
          <button
            type="submit"
            disabled={status === 'pending' || !Object.values(isValid).some((value) => value)}
            className={cn({
              [styles.modify__button]: true,
              [styles['modify__button--submit']]: true,
            })}
          >
            정보수정
          </button>
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
        </div>
      </form>
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
