import { cn } from '@bcsdlab/utils';
import CustomCheckbox from 'pages/Auth/SignupPage/components/CustomCheckbox';
import { privacy, koin, marketing } from 'static/terms';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import styles from './Terms.module.scss';

interface TermsProps {
  onNext: () => void;
}

export default function Terms({ onNext }: TermsProps) {
  const { register, setValue } = useFormContext();
  const [agreeState, setAgreeState] = useState({
    privacy: false,
    koinUsage: false,
    marketing: false,
  });

  const handleAllAgreeToggle = () => {
    const isAllChecked = !Object.values(agreeState).every(Boolean);
    setAgreeState(() => ({
      privacy: isAllChecked,
      koinUsage: isAllChecked,
      marketing: isAllChecked,
    }));
    Object.keys(agreeState).forEach((field) => setValue(field, isAllChecked));
  };

  const handleSingleAgreeToggle = (e: React.MouseEvent<HTMLElement>) => {
    const { id } = e.currentTarget;
    setAgreeState((prev) => ({
      ...prev,
      [id]: !prev[id as keyof typeof prev],
    }));
  };

  return (
    <div className={styles.container}>
      <span className={styles.title}>회원가입</span>
      <div className={styles.divider} />
      <div className={styles['container-terms']}>
        <label
          htmlFor="terms-agree"
          className={styles['all-terms-agree__label']}
        >
          <CustomCheckbox
            id="terms-agree"
            onChange={handleAllAgreeToggle}
            checked={Object.values(agreeState).every(Boolean)}
          />
          <span className={styles['all-terms-agree__title']}>
            아래 이용약관에 모두 동의합니다.
          </span>
        </label>
        <div className={styles['small-divider']} />
        <label className={styles.term} htmlFor="agreeToPrivacyPolicy">
          <CustomCheckbox
            id="agreeToPrivacyPolicy"
            checked={agreeState.privacy}
            onClick={handleSingleAgreeToggle}
            {...register('agreeToPrivacyPolicy')}
          />
          <span className={styles.term__title}>[필수] 개인정보 이용약관</span>
        </label>
        <textarea
          className={styles.term__content}
          readOnly
          defaultValue={privacy}
        />
        <label
          className={cn({
            [styles.term]: true,
            [styles['term__koin-use']]: true,
          })}
          htmlFor="agreeToKoinTerms"
        >
          <CustomCheckbox
            id="agreeToKoinTerms"
            checked={agreeState.koinUsage}
            onClick={handleSingleAgreeToggle}
            {...register('agreeToKoinTerms')}
          />
          <span className={styles.term__title}>[필수] 코인 이용약관</span>
        </label>
        <textarea
          className={styles.term__content}
          readOnly
          defaultValue={koin}
        />
        <label
          className={cn({
            [styles.term]: true,
            [styles.term__marketing]: true,
          })}
          htmlFor="agreeToMarketing"
        >
          <CustomCheckbox
            id="agreeToMarketing"
            checked={agreeState.marketing}
            onClick={handleSingleAgreeToggle}
            {...register('agreeToMarketing', { required: false })}
          />
          <span className={styles.term__title}>[선택] 마케팅 수신 동의</span>
        </label>
        <textarea
          className={styles.term__content}
          readOnly
          defaultValue={marketing}
        />
      </div>
      <div className={styles.divider} />
      <button
        type="submit"
        className={styles['term-button']}
        onClick={onNext}
        disabled={!(agreeState.privacy && agreeState.koinUsage)}
      >
        다음
      </button>
      <span className={styles.copyright}>
        COPYRIGHT © 2023 BCSD LAB ALL RIGHTS RESERVED.
      </span>
    </div>
  );
}
