import { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import CustomInput, { type InputMessage } from 'pages/Auth/SignupPage/components/CustomInput';
import styles from './MobileFindIdPage.module.scss';

function MobileFindIdPage() {
  const [phoneMessage, setPhoneMessage] = useState<InputMessage | null>(null);
  const [isModePhone, setIsModePhone] = useState(true);
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      phone_number: '',
      email: '',
      verification_code: '',
    },
  });

  const onSubmit = (data : any) => {
    console.log('입력된 데이터:', data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={styles.container}>
        <div className={styles['form-container']}>
          <div className={styles['name-gender-wrapper']}>
            <h1 className={styles['name-gender-wrapper__header']}>휴대전화 번호</h1>

            <Controller
              name="phone_number"
              control={methods.control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  isButton
                  buttonText="인증번호 발송"
                  buttonDisabled={false}
                  buttonOnClick={() => {}}
                  placeholder="- 없이 번호를 입력해 주세요."
                  isDelete
                />
              )}
            />
          </div>
          <div className={styles['name-gender-wrapper']}>
            <h1 className={styles['name-gender-wrapper__header']}>휴대전화 번호</h1>

            <Controller
              name="phone_number"
              control={methods.control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  isButton
                  buttonText="인증번호 확인"
                  buttonDisabled={false}
                  buttonOnClick={() => {}}
                  placeholder="인증번호를 입력해주세요."
                  isDelete
                >
                  <div className={styles['label-count-number']}>
                    휴대전화 등록을 안 하셨나요?
                  </div>
                </CustomInput>
              )}
            />
          </div>
        </div>
        <button
          type="button"
          // onClick={onNext}
          className={styles['next-button']}
          // disabled={!isFormFilled || !isCodeCorrect}
        >
          다음
        </button>
      </form>
    </FormProvider>

  );
}

export default MobileFindIdPage;
