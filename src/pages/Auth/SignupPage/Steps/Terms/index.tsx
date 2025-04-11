import { cn } from '@bcsdlab/utils';
import CustomCheckbox from 'pages/Auth/SignupPage/components/CustomCheckbox';
import { privacy, koin, marketing } from 'static/terms';
import { useFormContext } from 'react-hook-form';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './Terms.module.scss';

interface TermsProps {
  onNext: () => void;
}

const TERMS_NAMES = ['agreeToPrivacyPolicy', 'agreeToKoinTerms', 'agreeToMarketing'];

export default function Terms({ onNext }: TermsProps) {
  const { register, setValue, watch } = useFormContext();
  const isMobile = useMediaQuery();
  const watchAllTerms = watch(TERMS_NAMES);

  const handleAllAgreeToggle = () => {
    TERMS_NAMES.forEach((field) => setValue(field, !watchAllTerms.every(Boolean)));
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
            onChange={handleAllAgreeToggle}
            checked={watchAllTerms.every(Boolean)}
          />
          <span className={styles['all-terms-agree__title']}>
            {isMobile ? '모두 동의합니다.' : '아래 이용약관에 모두 동의합니다.'}
          </span>
        </label>
        {!isMobile && <div className={styles['small-divider']} /> }
        <label className={styles.term} htmlFor="agreeToPrivacyPolicy">
          <CustomCheckbox
            id="agreeToPrivacyPolicy"
            checked={watch('agreeToPrivacyPolicy')}
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
            checked={watch('agreeToKoinTerms')}
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
            checked={watch('agreeToMarketing')}
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
        disabled={!(watch(TERMS_NAMES.slice(0, 2)).every(Boolean))}
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
