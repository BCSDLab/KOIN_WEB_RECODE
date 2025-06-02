/* eslint-disable no-restricted-imports */
import { useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { checkPhone, smsSend, smsVerify } from 'api/auth';
import { useMutation } from '@tanstack/react-query';
import { isKoinError } from '@bcsdlab/koin';
import ROUTES from 'static/routes';
import { useNavigate } from 'react-router-dom';
import type { SmsSendResponse } from 'api/auth/entity';
import { MESSAGES } from 'static/auth';
import { cn } from '@bcsdlab/utils';
import BackIcon from 'assets/svg/arrow-back.svg';
import useCountdownTimer from 'pages/Auth/SignupPage/hooks/useCountdownTimer';
import PCCustomInput, { type InputMessage } from 'pages/Auth/SignupPage/components/PCCustomInput';
import styles from './PhonePage.module.scss';

interface VerificationProps {
  onNext: () => void;
  onBack: () => void;
}

function PCFindPasswordPhone({ onNext, onBack }: VerificationProps) {
  const navigate = useNavigate();
  const { control, register } = useFormContext();
  const name = useWatch({ control, name: 'name' });
  const gender = useWatch({ control, name: 'gender' });
  const phoneNumber = useWatch({ control, name: 'phone_number' });
  const verificationCode = useWatch({ control, name: 'verification_code' });

  const [, setShowVerificationField] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<InputMessage | null>(null);
  const [phoneMessage, setPhoneMessage] = useState<InputMessage | null>(null);
  const [isCodeCorrect, setIsCodeCorrect] = useState(false);
  const [smsSendCount, setSmsSendCount] = useState(0);
  const [buttonText, setButtonText] = useState('인증번호 발송');

  const { isRunning: isTimer, secondsLeft: timerValue, start: runTimer } = useCountdownTimer({
    duration: 180,
    onExpire: () => {
      if (!isCodeCorrect) {
        setVerificationMessage({ type: 'warning', content: MESSAGES.VERIFICATION.TIMEOUT });
      }
    },
  });

  const { mutate: sendSMSToUser } = useMutation({
    mutationFn: smsSend,
    onSuccess: (data : SmsSendResponse) => {
      setPhoneMessage({ type: 'success', content: MESSAGES.PHONE.CODE_SENT });
      runTimer();
      setShowVerificationField(true);
      setSmsSendCount(data.remaining_count);

      setSmsSendCount(data.remaining_count);

      if (data.remaining_count < 5) {
        setButtonText('인증번호 재발송');
      } else {
        setButtonText('인증번호 발송');
      }
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) {
          setPhoneMessage({ type: 'warning', content: MESSAGES.PHONE.INVALID });
        }
        if (err.status === 429) {
          setPhoneMessage({ type: 'error', content: MESSAGES.VERIFICATION.STOP });
        }
      }
    },
  });

  const { mutate: checkVerificationCode } = useMutation({
    mutationFn: smsVerify,
    onSuccess: () => {
      setVerificationMessage({ type: 'success', content: MESSAGES.VERIFICATION.CORRECT });
      setIsCodeCorrect(true);
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) {
          setVerificationMessage({ type: 'warning', content: MESSAGES.VERIFICATION.INCORRECT });
        }
        if (err.status === 404) {
          setVerificationMessage({ type: 'error', content: MESSAGES.VERIFICATION.TIMEOUT });
        }
      }
    },
  });

  const { mutate: checkPhoneNumber } = useMutation({
    mutationFn: checkPhone,
    onSuccess: () => {
      setIsCodeCorrect(false);
      sendSMSToUser({ phone_number: phoneNumber });
    },
    onError: (err) => {
      if (isKoinError(err)) {
        if (err.status === 400) {
          setPhoneMessage({ type: 'warning', content: MESSAGES.PHONE.INVALID });
        }

        if (err.status === 409) {
          setPhoneMessage({ type: 'error', content: MESSAGES.PHONE.ALREADY_REGISTERED, code: 'ALREADY_REGISTERED' });
        }
      }
    },
  });

  const isFormFilled = name && gender && phoneNumber && verificationCode && isCodeCorrect;

  const goToLogin = () => {
    navigate(ROUTES.Auth());
  };

  return (
    <div className={styles.container}>

      <div className={styles.container__wrapper}>
        <div className={styles['container__title-wrapper']}>
          <button
            type="button"
            onClick={onBack}
            aria-label="뒤로가기"
            className={styles['container__back-button']}
          >
            <BackIcon />
          </button>
          <h1 className={styles.container__title}>비밀번호 찾기</h1>
        </div>
      </div>

      <div className={`${styles.divider} ${styles['divider--top']}`} />

      <div className={styles['form-container']}>

        <div className={styles['input-wrapper']}>
          <Controller
            name="phone_number"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className={styles['input-with-button']}>
                <PCCustomInput
                  htmlFor="gender"
                  labelName="휴대전화"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setPhoneMessage(null);
                    setIsCodeCorrect(false);
                  }}
                  placeholder="숫자만 입력해 주세요."
                  isRequired
                  isDelete
                  message={phoneMessage}
                  onClear={() => {
                    setPhoneMessage(null);
                    setButtonText('인증번호 발송');
                  }}
                >
                  {phoneMessage?.type === 'success' && (
                  <div className={styles['label-count-number']}>
                    {' '}
                    남은 횟수 (
                    {smsSendCount}
                    /5)
                  </div>
                  )}
                  {phoneMessage?.type === 'error' && phoneMessage.code === 'ALREADY_REGISTERED' && (
                  <>
                    <button
                      onClick={goToLogin}
                      type="button"
                      className={styles['label-link-button']}
                    >
                      로그인하기
                    </button>
                    <span className={styles['label-link-split']}>|</span>
                    <a
                      href="https://open.kakao.com/o/sgiYx4Qg"
                      className={styles['label-link-wrapper__button']}
                    >
                      문의하기
                    </a>
                  </>
                  )}
                </PCCustomInput>
                <button
                  type="button"
                  onClick={() => checkPhoneNumber(phoneNumber)}
                  className={styles['check-button']}
                  disabled={!/^01[016789][0-9]{7,8}$/.test(field.value)}
                >
                  {buttonText}
                </button>
              </div>
            )}
          />
        </div>

        <div className={styles['input-wrapper']}>
          <Controller
            name="verification_code"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div className={styles['input-with-button']}>
                <PCCustomInput
                  {...field}
                  htmlFor="gender"
                  labelName="휴대전화 인증"
                  onChange={(e) => {
                    field.onChange(e);
                    setVerificationMessage(null);
                  }}
                  placeholder="인증번호를 입력해주세요."
                  isRequired
                  maxLength={6}
                  isDelete
                  isTimer={isCodeCorrect ? false : isTimer}
                  timerValue={timerValue}
                  message={verificationMessage}
                  onClear={() => {
                    setVerificationMessage(null);
                    setIsCodeCorrect(false);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    checkVerificationCode({
                      phone_number: phoneNumber,
                      verification_code: verificationCode,
                    });
                  }}
                  className={styles['check-button']}
                  disabled={!field.value || isCodeCorrect}
                >
                  인증번호 확인
                </button>
              </div>
            )}
          />
        </div>
      </div>

      <div className={`${styles.divider} ${styles['divider--bottom']}`} />

      <button
        type="button"
        onClick={onNext}
        className={cn({
          [styles['button-next']]: true,
          [styles['button-next--active']]: isFormFilled,
        })}
        disabled={!isFormFilled}
      >
        다음
      </button>
    </div>
  );
}

export default PCFindPasswordPhone;

// import { cn } from '@bcsdlab/utils';
// import BackIcon from 'assets/svg/arrow-back.svg';
// import PCCustomInput from 'pages/Auth/SignupPage/components/PCCustomInput';
// import {
//   Controller, useForm, useFormContext, useWatch,
// } from 'react-hook-form';
// import styles from './PhonePage.module.scss';

// interface FindPasswordProps {
//   onNext: () => void;
//   onBack: () => void;
// }

// function PCFindPassword({ onNext, onBack }: FindPasswordProps) {
//   const { control, register } = useFormContext();

//   const loginId = useWatch({ control, name: 'loginId' });
//   const contactType = useWatch({ control, name: 'contactType' });

//   const isFormFilled = contactType !== '';

//   return (
//     <div className={styles.container}>

//       <div className={styles.container__wrapper}>

//         <div className={styles['container__title-wrapper']}>
//           <button
//             type="button"
//             onClick={onBack}
//             aria-label="뒤로가기"
//             className={styles['container__back-button']}
//           >
//             <BackIcon />
//           </button>
//           <h1 className={styles.container__title}>비밀번호 찾기</h1>
//         </div>

//       </div>

//       <div className={`${styles.divider} ${styles['divider--top']}`} />

//       <div className={styles['form-container']}>

//         <div className={styles['input-wrapper']}>
//           <Controller
//             name="phone_number"
//             control={control}
//             defaultValue=""
//             render={({ field }) => (
//               <div className={styles['input-with-button']}>
//                 <PCCustomInput
//                   htmlFor="gender"
//                   labelName="휴대전화"
//                   {...field}
//                   onChange={(e) => {
//                     field.onChange(e);
//                     setPhoneMessage(null);
//                     setIsCodeCorrect(false);
//                   }}
//                   placeholder="숫자만 입력해 주세요."
//                   isRequired
//                   isDelete
//                   message={phoneMessage}
//                   onClear={() => {
//                     setPhoneMessage(null);
//                     setButtonText('인증번호 발송');
//                   }}
//                 >
//                   {phoneMessage?.type === 'success' && (
//                   <div className={styles['label-count-number']}>
//                     {' '}
//                     남은 횟수 (
//                     {smsSendCount}
//                     /5)
//                   </div>
//                   )}
//                   {phoneMessage?.type === 'error' &&
// phoneMessage.code === 'ALREADY_REGISTERED' && (
//                   <>
//                     <button
//                       onClick={goToLogin}
//                       type="button"
//                       className={styles['label-link-button']}
//                     >
//                       로그인하기
//                     </button>
//                     <span className={styles['label-link-split']}>|</span>
//                     <a
//                       href="https://open.kakao.com/o/sgiYx4Qg"
//                       className={styles['label-link-wrapper__button']}
//                     >
//                       문의하기
//                     </a>
//                   </>
//                   )}
//                 </PCCustomInput>
//                 <button
//                   type="button"
//                   onClick={() => checkPhoneNumber(phoneNumber)}
//                   className={styles['check-button']}
//                   disabled={!/^01[016789][0-9]{7,8}$/.test(field.value)}
//                 >
//                   {buttonText}
//                 </button>
//               </div>
//             )}
//           />
//         </div>

//         <div className={styles['input-wrapper']}>
//           <Controller
//             name="login_id"
//             control={control}
//             defaultValue=""
//             render={({ field, fieldState }) => (
//               <div className={styles['input-with-button']}>
//                 <PCCustomInput
//                   {...field}
//                   htmlFor="login_id"
//                   labelName="아이디"
//                   isRequired
//                   onChange={(e) => {
//                     field.onChange(e);
//                     // setIdMessage(null);
//                     // setInCorrectId();
//                   }}
//                   placeholder="5~13자리로 입력해 주세요."
//                   // message={fieldState.error ?
// { type: 'warning', content: MESSAGES.USERID.REQUIRED } : idMessage}
//                 />
//                 <button
//                   type="button"
//                   // onClick={() => checkUserId(loginId)}
//                   className={styles['check-button']}
//                   disabled={!!fieldState.error || !field.value}
//                 >
//                   중복 확인
//                 </button>
//               </div>
//             )}
//           />
//         </div>

//       </div>

//       <div className={`${styles.divider} ${styles['divider--bottom']}`} />

//       <button
//         type="button"
//         onClick={onNext}
//         className={cn({
//           [styles['button-next']]: true,
//           [styles['button-next--active']]: isFormFilled,
//         })}
//         disabled={!isFormFilled}
//       >
//         다음
//       </button>
//     </div>
//   );
// }

// export default PCFindPassword;
