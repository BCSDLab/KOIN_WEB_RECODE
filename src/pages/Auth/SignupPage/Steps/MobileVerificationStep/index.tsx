import { useForm } from 'react-hook-form';
import styles from './MobileVerification.module.scss';

// const ERROR_MESSAGES = {
//   INVALID_PHONE: '올바른 전화번호 양식이  아닙니다. 다시 입력해 주세요.',
//   ALREADY_REGISTERED: '이미 가입된 전화 번호입니다.',
//   CORRECT_VERIFICATION_CODE: '인증번호가 일치합니다.',
//   TIMEOUT_VERIFICATION_CODE: '유효시간이 지났습니다. 인증번호를 재발송 해주세요.',
//   INVALID_VERIFICATION_CODE: '인증번호가 일치하지 않습니다. 다시 입력해 주세요.',

// };

interface MobileVerificationProps {
  onNext: () => void;
}

function MobileVerification({ onNext }: MobileVerificationProps) {
  const { register } = useForm();
  const handleNext = () => {
    onNext();
  };
  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <h1 className={styles.inputContainer__header}>성별과 성별을 알려주세요.</h1>
        <input className={styles.inputContainer__input} type="text" placeholder="실명을 입력해 주세요." />
        <div>
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
      </div>

      <div className={styles.inputContainer}>
        <h1 className={styles.inputContainer__header}>휴대전화 번호를 입력해 주세요.</h1>
        <div className={styles.inputContainer__wrapper}>
          <input className={styles.inputContainer__input} type="text" placeholder="- 없이 번호를 입력해 주세요." />
          <button className={styles['inputContainer__wrapper--button']} type="button">인증번호 발송</button>
        </div>

        <div className={styles.inputContainer__wrapper}>
          <input className={styles.inputContainer__input} type="text" placeholder="인증번호를 입력해주세요." />
          <button className={styles['inputContainer__wrapper--button']} type="button">인증번호 확인</button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleNext}
      >
        다음으로
      </button>

    </div>
  );
}

export default MobileVerification;
