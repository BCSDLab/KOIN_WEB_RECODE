import { cn } from '@bcsdlab/utils';
import CustomCheckbox from 'pages/Auth/SignupPage/components/CustomCheckbox';
import { privacy, koin, marketing } from 'static/terms';
import styles from './Terms.module.scss';

interface TermsProps {
  onNext: () => void;
}

export default function Terms({ onNext }: TermsProps) {
  return (
    <div className={styles.container}>
      <span className={styles.title}>회원가입</span>
      <div className={styles.divider} />
      <div className={styles['container-terms']}>
        <label htmlFor="terms-agree" className={styles['all-terms-agree__label']}>
          <CustomCheckbox id="terms-agree" />
          <span className={styles['all-terms-agree__title']}>아래 이용약관에 모두 동의합니다.</span>
        </label>
        <div className={styles['small-divider']} />
        <div className={styles.term}>
          <CustomCheckbox />
          <span className={styles.term__title}>[필수] 개인정보 이용약관</span>
        </div>
        <textarea className={styles.term__content} readOnly defaultValue={privacy} />
        <div className={cn({
          [styles.term]: true,
          [styles['term__koin-use']]: true,
        })}
        >
          <CustomCheckbox />
          <span className={styles.term__title}>[필수] 코인 이용약관</span>
        </div>
        <textarea className={styles.term__content} readOnly defaultValue={koin} />
        <div className={cn({
          [styles.term]: true,
          [styles.term__marketing]: true,
        })}
        >
          <CustomCheckbox />
          <span className={styles.term__title}>[선택] 마케팅 수신 동의</span>
        </div>
        <textarea className={styles.term__content} readOnly defaultValue={marketing} />
      </div>
      <div className={styles.divider} />
      <button
        type="button"
        className={styles['term-button']}
        // disabled
        onClick={onNext}
      >
        다음
      </button>
      <span className={styles.copyright}>COPYRIGHT © 2023 BCSD LAB ALL RIGHTS RESERVED.</span>
    </div>
  );
}
