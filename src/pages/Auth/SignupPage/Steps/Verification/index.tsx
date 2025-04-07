import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Exclamation from 'assets/svg/exclamation.svg';
import showToast from 'utils/ts/showToast';
import { cn } from '@bcsdlab/utils';
import styles from './Verification.module.scss';

interface IForm {
  name: string;
  gender: number;
  phone: string;
  authNumber: string;
}

function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: {
      isSubmitting, isValid, errors,
    },
  } = useForm<IForm>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      gender: 0,
      phone: '',
      authNumber: '',
    },
  });

  // const [phone, setPhone] = useState('');
  const [sentCode, setSentCode] = useState<string | null>(null); // 발급된 인증번호
  const [expireTime, setExpireTime] = useState<number | null>(null); // 만료시간
  const [isVerified, setIsVerified] = useState<boolean>(false); // 인증성공 여부
  const [verificationError, setVerificationError] = useState<string | null>(null); // 메시지 출력용

  const phone = watch('phone');
  const authNumber = watch('authNumber');

  // 인증번호 발송 함수 (예시로 고정된 코드 사용)
  const sendVerificationMessage = () => {
    const code = '1234'; // 해당 부분에 api로 가져온 값 넣기. 현재는 임시로 생성
    const expireInMinutes = 3;

    setSentCode(code); // 정답 인증번호 저장
    setExpireTime(Date.now() + expireInMinutes * 60 * 1000); // 유효시간 저장
    setIsVerified(false); // 이전 인증 결과 초기화
    setVerificationError(null); // 메시지 초기화

    showToast('success', '인증번호가 발송되었습니다.');
  };

  // 인증번호 확인 함수
  const verifyCode = async () => {
    if (!expireTime || Date.now() > expireTime) {
      setIsVerified(false);
      setVerificationError('유효시간이 지났습니다. 인증번호를 재발송 해주세요.');
      showToast('error', '유효시간 초과');
      return;
    }

    if (authNumber === sentCode) {
      setIsVerified(true);
      setVerificationError(null); // 에러 메시지 없음
      showToast('success', '인증이 완료되었습니다.');
    } else {
      setIsVerified(false);
      setVerificationError('인증번호가 일치하지 않습니다. 다시 입력해 주세요.');
      showToast('error', '인증번호가 일치하지 않습니다.');
    }
  };

  // 폼 제출 시 호출되는 함수
  const onSubmit = (data: IForm) => {
    console.log(data);
    showToast('success', '제출이 완료되었습니다다.');

    // 첫 번째 페이지에서 입력받은 데이터를 두 번째 페이지로 전달
    navigate('/signup2', {
      state: data,
    });
  };

  return (
    <div className={styles.component}>
      <h1 className={styles.component__title}>회원가입</h1>
      <div className={styles.component__subTitleWrapper}>
        <span className={styles['component__subTitleWrapper-subTitle']}>
          <span className={styles.required}>*</span>
          필수 입력사항
        </span>
      </div>
      <div className={`${styles.divider} ${styles['divider--top']}`} />
      <div className={styles.component__form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
        >
          {/* <div className={styles.form__inputWrapper}>
            <label
              htmlFor="name"
              className={styles.form__label}
            >
              이름*
            </label>
            <input
              type="text"
              placeholder="이름을 입력해주세요."
              className={styles.form__input}
              {...register('name', { required: '이름을 입력해주세요.' })}
            />
          </div> */}
          <div className={styles.field}>
            <label
              htmlFor="name"
              className={styles.field__label}
            >
              이름
              <span className={styles.required}>*</span>
            </label>

            <div>
              <input
                type="text"
                placeholder="이름을 입력해 주세요."
                minLength={2}
                maxLength={5}
                {...register('name', { required: '이름을 입력해주세요.' })}
              />
              {errors.name && (
              <div className={styles.errorWrapper}>
                <Exclamation />
                <div className={styles.errorWrapper__message}>
                  {errors.name.message as string}
                </div>
              </div>
              )}
            </div>
          </div>

          {/* {(errors.name || errors.gender || errors.phone)
            && (
            <div className={styles.errorWrapper}>
              {errors.name && (
                <div className={styles.errorWrapper__message}>
                  {errors.name.message as string}
                </div>
              )}
              {errors.gender && (
                <div className={styles.errorWrapper__message}>
                  {errors.gender.message as string}
                </div>
              )}
              {errors.phone && (
                <div className={styles.errorWrapper__message}>
                  {errors.phone.message as string}
                </div>
              )}
            </div>
            )} */}

          <div className={styles.field}>
            <label
              htmlFor="gender"
              className={styles.field__label}
            >
              성별
              <span className={styles.required}>*</span>
            </label>

            <div className={styles.field__genderWrapper}>
              <label className={styles['field__gender-input']}>
                <input
                  type="radio"
                  value="male"
                  {...register('gender')}
                />
                남성
              </label>

              <label className={styles['field__gender-input']}>
                <input
                  type="radio"
                  value="female"
                  {...register('gender')}
                />
                여성
              </label>
            </div>
          </div>

          <div className={styles.form__inputWrapper}>
            <label
              htmlFor="number"
              className={styles.form__label}
            >
              휴대전화
              <span className={styles.required}>*</span>
            </label>

            <div className={styles.form__inputContainer}>
              <div>
                <input
                  type="text"
                  placeholder="숫자만 입력해 주세요."
                  className={styles.form__input}
                  maxLength={11}
                  {...register('phone', {
                    required: '휴대전화 번호를 입력해주세요.',
                    pattern: {
                      value: /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/,
                      message: '올바른 전화번호 양식이 아닙니다. 다시 입력해 주세요.',
                    },
                  })}
                />
                {errors.phone && (
                <div className={styles.errorWrapper}>
                  <Exclamation />
                  <div className={styles.errorWrapper__message}>
                    {errors.phone.message as string}
                  </div>
                </div>
                )}
              </div>

              {sentCode ? (
                <button
                  type="button"
                  onClick={sendVerificationMessage}
                  className={cn({
                    [styles.form__verifyButton]: true,
                    [styles['form__verifyButton--alive']]: phone.length > 0,
                  })}
                  disabled={phone.length <= 0}
                >
                  인증번호 재발송
                </button>
              ) : (
                <button
                  type="button"
                  onClick={sendVerificationMessage}
                  className={cn({
                    [styles.form__verifyButton]: true,
                    [styles['form__verifyButton--alive']]: phone.length >= 10,
                  })}
                  disabled={phone.length <= 0}
                >
                  인증번호 발송
                </button>
              )}
            </div>
          </div>

          <div className={styles.form__inputWrapper}>
            <label
              htmlFor="numberCheck"
              className={styles.form__label}
            >
              휴대전화 인증
              <span className={styles.required}>*</span>
            </label>

            <div className={styles.form__inputContainer}>
              <div>
                <input
                  type="text"
                  placeholder="인증번호를 입력해 주세요."
                  className={styles.form__input}
                  maxLength={6}
                  {...register('authNumber', {
                    required: '인증번호를 입력해주세요.',
                  })}
                />
                {verificationError && (
                <div className={styles.errorWrapper}>
                  <Exclamation />
                  <div className={styles.errorWrapper__message}>{verificationError}</div>
                </div>
                )}
              </div>

              <button
                type="button"
                onClick={verifyCode}
                className={cn({
                  [styles.form__verifyButton]: true,
                  [styles['form__verifyButton--alive']]: authNumber.length > 0,
                })}
              >
                인증번호 확인
              </button>
            </div>
          </div>
          <div className={`${styles.divider} ${styles['divider--bottom']}`} />
          <div className={styles.buttonWrapper}>
            <button
              type="submit"
              className={cn({
                [styles['buttonWrapper__button-koreatech']]: true,
                [styles['buttonWrapper__button-koreatech--active']]: isValid && isVerified,
              })}
              disabled={!isValid || !isVerified || isSubmitting}
            >
              한국기술교육대학교 학생
            </button>

            <button
              type="submit"
              className={cn({
                [styles['buttonWrapper__button-outsider']]: true,
                [styles['buttonWrapper__button-outsider--active']]: isValid && isVerified,
              })}
              disabled={!isValid || !isVerified || isSubmitting}
            >
              기타 / 외부인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
