import { cn } from '@bcsdlab/utils';
import BackIcon from 'assets/svg/arrow-back.svg';
import PCCustomInput from 'pages/Auth/SignupPage/components/PCCustomInput';
import {
  Controller, useForm, useFormContext, useWatch,
} from 'react-hook-form';
import styles from './PCFindPasswordPage.module.scss';

interface FindPasswordProps {
  onNext: () => void;
  onBack: () => void;
}

function PCFindPassword({ onNext, onBack }: FindPasswordProps) {
  const { control, register } = useFormContext();

  const loginId = useWatch({ control, name: 'loginId' });
  const contactType = useWatch({ control, name: 'contactType' });

  const isFormFilled = contactType !== '';

  // const onNext = () => {
  //   if (contactType === 'phone') {
  //     navigate(ROUTES.AuthFindPasswordPhone());
  //   } else if (contactType === 'email') {
  //     navigate(ROUTES.AuthFindPasswordEmail());
  //   }
  // };

  // const methods = useForm({
  //   mode: 'onChange',
  //   defaultValues: {
  //     login_id: '',
  //     password: '',
  //     password_check: '',
  //     phone: null,
  //     email: null,
  //     verification_code: '',
  //   },
  // });

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
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <PCCustomInput
                {...field}
                htmlFor="name"
                labelName="아이디"
                placeholder="아이디를 입력해 주세요."
                isDelete
              />
            )}
          />
        </div>

        <div className={styles['contactType-wrapper']}>
          <label
            htmlFor="contactType"
            className={styles.wrapper__label}
          >
            인증수단
          </label>

          <div className={styles['checkbox-wrapper']}>
            <label className={styles['checkbox-wrapper__checkbox']}>
              <input type="radio" value="PHONE" {...register('contactType')} />
              <div>전화번호</div>
            </label>
            <label className={styles['checkbox-wrapper__checkbox']}>
              <input type="radio" value="EMAIL" {...register('contactType')} />
              <div>이메일</div>
            </label>
          </div>
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

export default PCFindPassword;
