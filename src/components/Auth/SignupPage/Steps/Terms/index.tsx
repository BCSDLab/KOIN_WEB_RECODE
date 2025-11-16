import { cn } from '@bcsdlab/utils';
import CustomCheckbox from 'components/Auth/SignupPage/components/CustomCheckbox';
import { useFormContext } from 'react-hook-form';
import { privacy, koin, marketing } from 'static/terms';
import { useSessionLogger } from 'utils/hooks/analytics/useSessionLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './Terms.module.scss';

interface TermsProps {
  onNext: () => void;
}

const TERMS_NAMES = ['privacy_policy_agreement', 'koin_terms_agreement', 'marketing_notification_agreement'];

export default function Terms({ onNext }: TermsProps) {
  const { register, setValue, watch } = useFormContext();
  const isMobile = useMediaQuery();
  const watchAllTerms = watch(TERMS_NAMES);
  const currentYear = new Date().getFullYear();
  const sessionLogger = useSessionLogger();

  const handleAllAgreeToggle = () => {
    TERMS_NAMES.forEach((field) => setValue(field, !watchAllTerms.every(Boolean)));
  };

  const onClickNext = () => {
    onNext();
    sessionLogger.actionSessionEvent({
      event_label: 'terms_agreement',
      value: '약관동의',
      event_category: 'click',
      session_name: 'sign_up',
    });
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
        <label htmlFor="terms-agree" className={styles['all-terms-agree__label']}>
          <CustomCheckbox id="terms-agree" onChange={handleAllAgreeToggle} checked={watchAllTerms.every(Boolean)} />
          <span className={styles['all-terms-agree__title']}>
            {isMobile ? '모두 동의합니다.' : '아래 이용약관에 모두 동의합니다.'}
          </span>
        </label>
        {!isMobile && <div className={styles['small-divider']} />}
        <label className={styles.term} htmlFor="privacy_policy_agreement">
          <CustomCheckbox
            id="privacy_policy_agreement"
            checked={watch('privacy_policy_agreement')}
            {...register('privacy_policy_agreement')}
          />
          <span className={styles.term__title}>
            {isMobile ? '개인정보 이용약관(필수)' : '[필수] 개인정보 이용약관'}
          </span>
        </label>
        <textarea className={styles.term__content} readOnly defaultValue={privacy} />
        <label
          className={cn({
            [styles.term]: true,
            [styles['term__koin-use']]: true,
          })}
          htmlFor="koin_terms_agreement"
        >
          <CustomCheckbox
            id="koin_terms_agreement"
            checked={watch('koin_terms_agreement')}
            {...register('koin_terms_agreement')}
          />
          <span className={styles.term__title}>{isMobile ? '코인 이용약관(필수)' : '[필수] 코인 이용약관'}</span>
        </label>
        <textarea className={styles.term__content} readOnly defaultValue={koin} />
        <label
          className={cn({
            [styles.term]: true,
            [styles.term__marketing]: true,
          })}
          htmlFor="marketing_notification_agreement"
        >
          <CustomCheckbox
            id="marketing_notification_agreement"
            checked={watch('marketing_notification_agreement')}
            {...register('marketing_notification_agreement', { required: false })}
          />
          <span className={styles.term__title}>{isMobile ? '마케팅 수신 동의(선택)' : '[선택] 마케팅 수신 동의'}</span>
        </label>
        <textarea className={styles.term__content} readOnly defaultValue={marketing} />
      </div>
      {!isMobile && <div className={styles.divider} />}
      <button
        type="button"
        className={styles['term-button']}
        onClick={onClickNext}
        disabled={!watch(TERMS_NAMES.slice(0, 2)).every(Boolean)}
      >
        다음
      </button>
      {!isMobile && (
        <span className={styles.copyright}>COPYRIGHT &copy; {currentYear} BCSD LAB ALL RIGHTS RESERVED.</span>
      )}
    </div>
  );
}
