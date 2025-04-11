import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import showToast from 'utils/ts/showToast';
import styles from './Verification.module.scss';

function SignUp() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  // 인증번호 발송 함수 (예시로 고정된 코드 사용)
  const sendVerificationMessage = () => {
    const code = '1234';
    setSentCode(code);
    showToast('success', '인증번호가 발송되었습니다.');
  };

  // 인증번호 확인 함수
  const verifyCode = () => {
    if (verificationCode === sentCode) {
      setIsVerified(true);
      showToast('success', '인증이 완료되었습니다.');
    } else {
      showToast('success', '인증번호가 일치하지 않습니다.');
    }
  };

  // 폼 제출 시 호출되는 함수
  const onSubmit = (data: any) => {
    if (!isVerified) {
      showToast('success', '휴대전화 인증이 완료되지 않았습니다.');
      return;
    }
    // 첫 번째 페이지에서 입력받은 데이터를 두 번째 페이지로 전달
    navigate('/signup2', {
      state: data,
    });
  };

  return (
    <div className={styles.component}>
      <h1 className={styles.component__title}>회원가입</h1>
      <div className={styles.component__subTitleWrapper}>
        <span className={styles['component__subTitleWrapper-subTitle']}>*필수 입력사항</span>
      </div>
      <div className={`${styles.divider} ${styles['divider--top']}`} />
      <div className={styles.component__form}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
            >
              이름
              <span className={styles.required}>*</span>
            </label>
            <input type="text" placeholder="이름을 입력해 주세요." />
          </div>

          <div className={styles.form__inputWrapper}>
            <label
              htmlFor="gender"
              className={styles.form__label}
            >
              성별*
            </label>
            <label>
              <input
                type="checkbox"
                value="male"
                {...register('gender')}
              />
              남성
            </label>
            <label>
              <input
                type="checkbox"
                value="female"
                {...register('gender')}
              />
              여성
            </label>
          </div>

          <div className={styles.form__inputWrapper}>
            <label
              htmlFor="number"
              className={styles.form__label}
            >
              휴대전화*
            </label>
            <input
              type="number"
              placeholder="숫자만 입력해 주세요."
              className={styles.form__input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              {...register('phone', { required: '휴대전화 번호를 입력해주세요.' })}
            />
            <button
              type="button"
              onClick={sendVerificationMessage}
              className={styles.form__verifyButton}
            >
              인증번호 발송
            </button>
          </div>

          <div className={styles.form__inputWrapper}>
            <label
              htmlFor="numberCheck"
              className={styles.form__label}
            >
              휴대전화 인증*
            </label>
            <input
              type="text"
              placeholder="인증번호를 입력해 주세요."
              className={styles.form__input}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <button
              type="button"
              onClick={verifyCode}
              className={styles.form__verifyButton}
            >
              인증번호 확인
            </button>
          </div>
          <div className={`${styles.divider} ${styles['divider--bottom']}`} />
          <div className={styles.buttonWrapper}>
            <button type="submit" className={styles.buttonWrapper__button}>한국기술교육대학교 학생</button>
            <button type="submit" className={styles.buttonWrapper__button}>기타 / 외부인</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
