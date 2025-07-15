import LoadingSpinner from 'components/feedback/LoadingSpinner';
import {
  Suspense, useCallback, useEffect, useState,
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ChevronLeftIcon from 'assets/svg/Login/chevron-left.svg';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import showToast from 'utils/ts/showToast';
import useLogger from 'utils/hooks/analytics/useLogger';
import ProgressBar from './components/ProgressBar';
import MobileVerification from './Steps/MobileVerificationStep';
import Terms from './Steps/Terms';
import useStep from './hooks/useStep';
import MobileUserTypeStep from './Steps/MobileUserTypeStep';
import MobileStudentDetailStep from './Steps/MobileStudentDetailStep';
import MobileGuestDetailStep from './Steps/MobileExternalDetailStep';
import styles from './SignupPage.module.scss';
import Verification from './Steps/VerificationStep';
import StudentDetail from './Steps/StudentDetailStep';
import ExternalDetail from './Steps/ExternalDetailStep';
import CompleteStep from './Steps/CompleteStep';

type StepTitle = '약관동의' | '본인인증' | '회원유형선택' | '정보입력' | '완료';
type UserType = '학생' | '외부인';

const mobileSteps: StepTitle[] = ['약관동의', '본인인증', '회원유형선택', '정보입력', '완료'];
const desktopSteps: StepTitle[] = ['약관동의', '본인인증', '정보입력', '완료'];

function SignupPage() {
  const logger = useLogger();
  const isMobile = useMediaQuery();
  const activeSteps = isMobile ? mobileSteps : desktopSteps;

  const {
    Step, nextStep, goBack, currentStep,
  } = useStep<StepTitle>(activeSteps);

  const currentIndex = activeSteps.indexOf(currentStep);
  const [userType, setUserType] = useState<UserType | null>(null);

  const onClickStudent = (user: string) => {
    if (user === '학생') {
      setUserType('학생');
      logger.actionEventClick({
        team: 'USER',
        event_label: 'create_account',
        value: '학생',
        custom_session_id: '도훈',
      });
    } else if (user === '외부인') {
      setUserType('외부인');
      logger.actionEventClick({
        team: 'USER',
        event_label: 'create_account',
        value: '외부인',
        custom_session_id: '도훈',
      });
    }
  };

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone_number: '',
      login_id: '',
      password: '',
      password_check: '',
      department: '',
      student_number: '',
      gender: '',
      email: null,
      nickname: null,
      verification_code: '',
      privacy_policy_agreement: false,
      koin_terms_agreement: false,
      marketing_notification_agreement: false,
      isCorrect: false,
      verificationMessage: null,
      phoneMessage: null,
      isDisabled: false,
    },
  });

  const goToFirstStep = useCallback(() => {
    nextStep('약관동의');
  }, [nextStep]);

  useEffect(() => {
    if (currentStep === '완료') {
      if (methods.getValues('name')) {
        methods.reset();
      }
      return;
    }

    const isAgreements = methods.getValues('privacy_policy_agreement') && methods.getValues('koin_terms_agreement');
    if (currentStep === '본인인증' && !isAgreements) {
      showToast('warning', '약관에 동의해주세요.');
      goToFirstStep();
      return;
    }
    const isVerificationStepPassed = methods.getValues('name') && methods.getValues('phone_number') && methods.getValues('gender');

    if ((currentStep === '회원유형선택' && !isVerificationStepPassed)
      || (currentStep === '정보입력' && (!isVerificationStepPassed || !userType))) {
      showToast('warning', '잘못된 접근입니다.');
      goToFirstStep();
    }
  }, [currentStep, userType, methods, goToFirstStep, isMobile]);

  return (
    <Suspense fallback={<LoadingSpinner size="50px" />}>
      <div className={styles.container}>
        {isMobile && (
        <div className={styles.container__header}>
          <button
            type="button"
            className={styles.container__button}
            onClick={goBack}
            aria-label="button"
          >
            <ChevronLeftIcon />
          </button>
          <span className={styles.container__title}>회원가입</span>
        </div>
        )}

        {currentStep !== '완료' && (
          <ProgressBar
            steps={activeSteps.map((title) => ({ title }))}
            currentIndex={currentIndex}
          />
        )}
        <FormProvider {...methods}>
          <Step name="약관동의">
            <Terms onNext={() => nextStep('본인인증')} />
          </Step>
          <Step name="본인인증">
            {isMobile ? (
              <MobileVerification onNext={() => nextStep('회원유형선택')} />
            ) : (
              <Verification
                onNext={() => nextStep('정보입력')}
                onBack={goBack}
                setUserType={setUserType}
              />
            )}
          </Step>
          <Step name="회원유형선택">
            <MobileUserTypeStep
              onSelectType={(type: UserType) => {
                // setUserType(type);
                onClickStudent(type);
                nextStep('정보입력');
              }}
            />
          </Step>
          <Step name="정보입력">
            {userType === '학생' && (
              isMobile
                ? <MobileStudentDetailStep onNext={() => nextStep('완료', { replace: true })} />
                : <StudentDetail onNext={() => nextStep('완료', { replace: true })} onBack={goBack} />
            )}

            {userType === '외부인' && (
              isMobile
                ? <MobileGuestDetailStep onNext={() => nextStep('완료', { replace: true })} />
                : <ExternalDetail onNext={() => nextStep('완료', { replace: true })} onBack={goBack} />
            )}
          </Step>
          <Step name="완료">
            <CompleteStep />
          </Step>
        </FormProvider>
      </div>
    </Suspense>
  );
}

export default SignupPage;
