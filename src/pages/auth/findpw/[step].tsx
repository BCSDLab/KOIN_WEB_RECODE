import LoadingSpinner from 'components/feedback/LoadingSpinner';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ChevronLeftIcon from 'assets/svg/Login/chevron-left.svg';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import ProgressBar from 'components/Auth/SignupPage/components/ProgressBar';
import ROUTES from 'static/routes';
import { ContactType } from 'static/auth';
import showToast from 'utils/ts/showToast';
import CompletePage from 'components/Auth/FindPasswordPage/Complete';
import PCVerifyEmail from 'components/Auth/FindPasswordPage/PC/PCVerifyEmail';
import PCResetPasswordPhone from 'components/Auth/FindPasswordPage/PC/PCResetPasswordPhone';
import MobileVerifyPhone from 'components/Auth/FindPasswordPage/Mobile/MobileVerifyPhone';
import MobileVerifyEmail from 'components/Auth/FindPasswordPage/Mobile/MobileVerifyEmail';
import MobileResetPassword from 'components/Auth/FindPasswordPage/Mobile/MobileResetPassword';
import PCVerifyPhone from 'components/Auth/FindPasswordPage/PC/PCVerifyPhone';
import { useRouter } from 'next/router';
import FindPWLayout from 'components/Auth/FindPasswordPage/Layout';
import styles from './FindPasswordPage.module.scss';

type StepTitle = '계정인증' | '이메일인증' | '비밀번호변경' | '완료';
type ProgressStepTitle = '계정인증' | '비밀번호변경' | '완료';

const stepToProgress: Record<StepTitle, ProgressStepTitle> = {
  계정인증: '계정인증',
  이메일인증: '계정인증', // 이메일인증도 진행상 '계정인증'
  비밀번호변경: '비밀번호변경',
  완료: '완료',
};

type StepProps<T> = {
  step: T;
  name: T;
  children: React.ReactNode;
};

function Step<T extends string>({ step, name, children }: StepProps<T>) {
  return step === name ? <div>{children}</div> : null;
}

function FindPasswordPage({ step }: { step: StepTitle }) {
  const isMobile = useMediaQuery();
  const router = useRouter();
  const [contactType, setContactType] = useState<ContactType>('PHONE');

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      loginId: '',
      phoneNumber: '',
      email: '',
      verificationCode: '',
      password: '',
      password_check: '',
      newPassword: '',
      newPasswordCheck: '',
      isCorrect: false,
      verificationMessage: null,
      phoneMessage: null,
      idMessage: null,
      isDisabled: false,
    },
  });

  const goToFirstStep = useCallback(() => {
    router.push(ROUTES.AuthFindPW({ step: '계정인증', isLink: true }));
  }, [router]);

  useEffect(() => {
    if (step === '완료') {
      if (methods.getValues('newPassword')) {
        methods.reset();
      }
      return;
    }

    const loginId = methods.getValues('loginId');
    const verificationCode = methods.getValues('verificationCode');

    if (step === '비밀번호변경' && (!loginId || !verificationCode)) {
      showToast('warning', '잘못된 접근입니다. 계정 인증을 먼저 진행해주세요.');
      goToFirstStep();
    }
  }, [step, methods, goToFirstStep]);

  if (!step) {
    router.push(ROUTES.Auth());
    return null;
  }

  const nextStep = (next: StepTitle, options?: { replace: boolean }) => {
    if (options?.replace) {
      router.replace(ROUTES.AuthFindPW({ step: next, isLink: true }));
      return;
    }
    router.push(ROUTES.AuthFindPW({ step: next, isLink: true }));
  };

  const goBack = () => router.back();

  const progressSteps: ProgressStepTitle[] = ['계정인증', '비밀번호변경'];
  const progressStep = stepToProgress[step];
  const currentIndex = progressSteps.indexOf(progressStep);

  return (
    <Suspense fallback={<LoadingSpinner size="50px" />}>
      <div className={styles.container}>
        {isMobile && step !== '완료' && (
          <div className={styles.container__header}>
            <button type="button" className={styles.container__button} onClick={goBack} aria-label="뒤로가기">
              <ChevronLeftIcon />
            </button>
            <span className={styles.container__title}>비밀번호 찾기</span>
          </div>
        )}

        {step !== '완료' && (
          <ProgressBar steps={progressSteps.map((title) => ({ title }))} currentIndex={currentIndex} />
        )}

        <FormProvider {...methods}>
          <Step step={step} name="계정인증">
            {isMobile ? (
              <MobileVerifyPhone
                onNext={() => nextStep('비밀번호변경')}
                goToEmailStep={() => nextStep('이메일인증')}
                setContactType={setContactType}
              />
            ) : (
              <PCVerifyPhone
                onNext={() => nextStep('비밀번호변경')}
                onBack={goBack}
                goToEmailStep={() => nextStep('이메일인증')}
                setContactType={setContactType}
              />
            )}
          </Step>

          <Step step={step} name="이메일인증">
            {isMobile ? (
              <MobileVerifyEmail onNext={() => nextStep('비밀번호변경')} setContactType={setContactType} />
            ) : (
              <PCVerifyEmail onNext={() => nextStep('비밀번호변경')} onBack={goBack} setContactType={setContactType} />
            )}
          </Step>

          <Step step={step} name="비밀번호변경">
            {isMobile ? (
              <MobileResetPassword onNext={() => nextStep('완료')} onBack={goBack} contactType={contactType} />
            ) : (
              <PCResetPasswordPhone onNext={() => nextStep('완료')} onBack={goBack} contactType={contactType} />
            )}
          </Step>

          <Step step={step} name="완료">
            <CompletePage />
          </Step>
        </FormProvider>
      </div>
    </Suspense>
  );
}

function FindPassword() {
  const router = useRouter();

  const { step } = router.query as { step?: StepTitle };
  if (!step) return null;
  return <FindPasswordPage step={step} />;
}

FindPassword.getLayout = (page: React.ReactNode) => <FindPWLayout>{page}</FindPWLayout>;

export default FindPassword;
