import { cn } from '@bcsdlab/utils';
import CustomCheckbox from 'pages/Auth/SignupPage/components/CustomCheckbox';
import { privacy, koin, marketing } from 'static/terms';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './Terms.module.scss';

interface TermsProps {
  onNext: () => void;
}

export default function Terms({ onNext }: TermsProps) {
  const { register, setValue } = useFormContext();
  const isMobile = useMediaQuery();
  const [agreeState, setAgreeState] = useState({
    agreeToPrivacyPolicy: false,
    agreeToKoinTerms: false,
    agreeToMarketing: false,
  });
  const isAllChecked = !Object.values(agreeState).every(Boolean);

  const handleAllAgreeToggle = () => {
    setAgreeState(() => ({
      agreeToPrivacyPolicy: isAllChecked,
      agreeToKoinTerms: isAllChecked,
      agreeToMarketing: isAllChecked,
    }));
    Object.keys(agreeState).forEach((field) => setValue(field, isAllChecked));
  };

  const handleSingleAgreeToggle = (e: React.MouseEvent<HTMLElement>) => {
    const { id } = e.currentTarget;
    setAgreeState((prev) => ({
      ...prev,
      [id]: !prev[id as keyof typeof prev],
    }));
    setValue('agreeToAll', isAllChecked);
  };

  return (
    <div className={styles.container}>
      {!isMobile && (
        <>
          <span className={styles.title}>회원가입</span>
          <div className={styles.divider} />
        </>
      )}
      <div className={styles['container-terms']}>
        <label
          htmlFor="terms-agree"
          className={styles['all-terms-agree__label']}
        >
          <CustomCheckbox
            id="terms-agree"
            onClick={handleAllAgreeToggle}
            checked={Object.values(agreeState).every(Boolean)}
            {...register('agreeToAll', { required: false })}
          />
          <span className={styles['all-terms-agree__title']}>
            {isMobile ? '모두 동의합니다.' : '아래 이용약관에 모두 동의합니다.'}
          </span>
        </label>
        {!isMobile && <div className={styles['small-divider']} /> }
        <label className={styles.term} htmlFor="agreeToPrivacyPolicy">
          <CustomCheckbox
            id="agreeToPrivacyPolicy"
            checked={agreeState.agreeToPrivacyPolicy}
            onClick={handleSingleAgreeToggle}
            {...register('agreeToPrivacyPolicy')}
          />
          <span className={styles.term__title}>{isMobile ? '개인정보 이용약관(필수)' : '[필수] 개인정보 이용약관'}</span>
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
            checked={agreeState.agreeToKoinTerms}
            onClick={handleSingleAgreeToggle}
            {...register('agreeToKoinTerms')}
          />
          <span className={styles.term__title}>
            {isMobile ? '코인 이용약관(필수)' : '[필수] 코인 이용약관'}
          </span>
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
            checked={agreeState.agreeToMarketing}
            onClick={handleSingleAgreeToggle}
            {...register('agreeToMarketing', { required: false })}
          />
          <span className={styles.term__title}>
            {isMobile ? '마케팅 수신 동의(선택)' : '[선택] 마케팅 수신 동의'}
          </span>
        </label>
        <textarea
          className={styles.term__content}
          readOnly
          defaultValue={marketing}
        />
      </div>
      {!isMobile && <div className={styles.divider} />}
      <button
        type="button"
        className={styles['term-button']}
        onClick={onNext}
        disabled={!(agreeState.agreeToPrivacyPolicy && agreeState.agreeToKoinTerms)}
      >
        다음
      </button>
      {!isMobile && (
      <span className={styles.copyright}>
        COPYRIGHT &copy; 2023 BCSD LAB ALL RIGHTS RESERVED.
      </span>
      )}
    </div>
  );
}
