import LoadingSpinner from 'components/feedback/LoadingSpinner';
import { Suspense, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ChevronLeftIcon from 'assets/svg/Login/chevron-left.svg';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
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

type StepTitle = '약관 동의' | '본인 인증' | '회원 유형 선택' | '정보 입력' | '완료';
type UserType = '학생' | '외부인';

const stepTitles: StepTitle[] = ['약관 동의', '본인 인증', '회원 유형 선택', '정보 입력', '완료'];

function SignupPage() {
  const {
    Step, nextStep, goBack, currentStep,
  } = useStep<StepTitle>('약관 동의');
  const currentIndex = stepTitles.indexOf(currentStep);
  const [userType, setUserType] = useState<UserType | null>(null);
  const isMobile = useMediaQuery();

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone_number: '',
      user_id: '',
      password: '',
      password_check: '',
      department: '',
      student_number: '',
      gender: '',
      email: '',
      nickname: '',
      verification_code: '',
    },
  });

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
            steps={stepTitles.map((title) => ({ title }))}
            currentIndex={currentIndex}
          />
        )}
        <FormProvider {...methods}>
          <Step name="약관 동의">
            <Terms onNext={() => nextStep('본인 인증')} />
          </Step>
          <Step name="본인 인증">
            {isMobile ? (
              <MobileVerification onNext={() => nextStep('회원 유형 선택')} />
            ) : (
              <Verification
                onNext={() => nextStep('정보 입력')}
                setUserType={setUserType}
              />
            )}
          </Step>
          <Step name="회원 유형 선택">
            <MobileUserTypeStep
              onSelectType={(type: UserType) => {
                setUserType(type);
                nextStep('정보 입력');
              }}
            />
          </Step>
          <Step name="정보 입력">
            {userType === '학생' && (
              isMobile
                ? <MobileStudentDetailStep onNext={() => nextStep('완료')} />
                : <StudentDetail />
            )}

            {userType === '외부인' && (
              isMobile
                ? <MobileGuestDetailStep onNext={() => nextStep('완료')} />
                : <ExternalDetail onNext={() => nextStep('완료')} />
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
