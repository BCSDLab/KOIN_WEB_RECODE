import LoadingSpinner from 'components/feedback/LoadingSpinner';
import { Suspense, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import ChevronLeftIcon from 'assets/svg/Login/chevron-left.svg';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import ProgressBar from 'pages/Auth/SignupPage/components/ProgressBar';
import styles from './FindPasswordPage.module.scss';
import PCFindPassword from './PC';
import MobileFindPassword from './Mobile';
import MobileFindPwPhone from './Mobile/PhonePage';
import MobileFindPwEmail from './Mobile/EmailPage';
import PCFindPwPhone from './PC/PhonePage';
import PCFindPwEmail from './PC/EmailPage';
import CompletePage from './Complete';
import useStep from './hooks/useStep';
import PCFindPasswordPhone from './PC/PhonePage';

type StepTitle = '계정인증' | '비밀번호변경' | '완료';
type ContactType = 'PHONE' | 'EMAIL';

const stepTitles: StepTitle[] = ['계정인증', '비밀번호변경', '완료'];
const prograssBar: StepTitle[] = ['계정인증', '비밀번호변경'];

function FindPasswordPage() {
  const isMobile = useMediaQuery();

  const {
    Step,
    nextStep,
    goBack,
    currentStep,
  } = useStep<StepTitle>('계정인증');

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      phone_number: '',
      login_id: '',
      password: '',
      password_check: '',
      phone: null,
      email: null,
      verification_code: '',
    },
  });

  const currentIndex = stepTitles.indexOf(currentStep);
  const contactType = useWatch({ control: methods.control, name: 'contactType' }) as ContactType | null;
  console.log('[Debug] contactType:', contactType);
  return (
    <Suspense fallback={<LoadingSpinner size="50px" />}>
      <div className={styles.container}>
        {isMobile && (
          <div className={styles.container__header}>
            <button
              type="button"
              className={styles.container__button}
              onClick={goBack}
              aria-label="뒤로가기"
            >
              <ChevronLeftIcon />
            </button>
            <span className={styles.container__title}>비밀번호 찾기</span>
          </div>
        )}

        {currentStep !== '완료' && (
          <ProgressBar
            steps={prograssBar.map((title) => ({ title }))}
            currentIndex={currentIndex}
          />
        )}

        <FormProvider {...methods}>
          <Step name="계정인증" step={currentStep}>
            {isMobile ? (
              <MobileFindPassword
                onNext={() => nextStep('비밀번호변경')}
                onBack={goBack}
                setContactType={contactType}
              />
            ) : (
              <PCFindPassword
                onNext={() => nextStep('비밀번호변경')}
                onBack={goBack}
              />
            )}
          </Step>

          <Step name="비밀번호변경" step={currentStep}>
            {contactType === 'PHONE' && (
              isMobile
                ? <MobileFindPwPhone onNext={() => nextStep('완료')} onBack={goBack} />
                : <PCFindPasswordPhone onNext={() => nextStep('완료')} onBack={goBack} />
            )}

            {contactType === 'EMAIL' && (
              isMobile
                ? <MobileFindPwEmail onNext={() => nextStep('완료')} onBack={goBack} />
                : <PCFindPwEmail onNext={() => nextStep('완료')} onBack={goBack} />
            )}
          </Step>

          <Step name="완료" step={currentStep}>
            <CompletePage />
          </Step>
        </FormProvider>
      </div>
    </Suspense>
  );
}

export default FindPasswordPage;

// import React from 'react';
// import { auth } from 'api';
// import showToast from 'utils/ts/showToast';
// import { useMutation } from '@tanstack/react-query';
// import styles from './FindPasswordPage.module.scss';

// interface IClassUser {
//   userId: HTMLInputElement | null
// }

// const emailLocalPartRegex = /^[a-z_0-9]{1,12}$/;

// const useFindPassword = () => {
//   const postFindPassword = useMutation({
//     mutationFn: auth.findPassword,
//     onSuccess: () => {
//       showToast('success', '비밀번호 초기화 메일을 전송했습니다. 아우누리에서 확인해주세요.');
//     },
//   });

//   const findPassword = async (userId: string) => {
//     if (userId === null) {
//       showToast('error', '계정을 입력해주세요');
//       return;
//     }
//     if (userId.indexOf('@koreatech.ac.kr') !== -1) {
//       showToast('error', '계정명은 @koreatech.ac.kr을 빼고 입력해주세요.'); // 모든 alert는 Toast로 교체 예정
//       return;
//     }
//     if (!emailLocalPartRegex.test(userId)) {
//       showToast('error', '아우누리 계정 형식이 아닙니다.');
//       return;
//     }

//     postFindPassword.mutate({
//       email: `${userId}@koreatech.ac.kr`,
//     });
//   };
//   return findPassword;
// };

// function FindPasswordPage() {
//   const FindIdRef = React.useRef<IClassUser>({
//     userId: null,
//   });
//   const submitFindPassword = useFindPassword();
//   const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const { userId } = FindIdRef.current;
//     submitFindPassword(userId!.value);
//   };

//   return (
//     <div className={styles.template}>
//       <form className={styles.findpasswordform} onSubmit={onSubmit}>
//         <input
//           ref={(inputRef) => { FindIdRef.current.userId = inputRef; }}
//           className={styles['form-input']}
//           autoComplete="username"
//           name="userId"
//           placeholder="아우누리 아이디를 입력하세요"
//         />
//         <button type="submit" className={styles.findpasswordform__button}>
//           비밀번호 찾기
//         </button>
//       </form>
//       <span className={styles.findpasswordform__advice}>학교메일로 비밀번호 초기화 메일이 발송됩니다.</span>
//       <span className={styles.template__copyright}>
//         COPYRIGHT ⓒ&nbsp;
//         {
//             new Date().getFullYear()
//           }
//           &nbsp;BY BCSDLab ALL RIGHTS RESERVED.
//       </span>
//     </div>
//   );
// }

// export default FindPasswordPage;
