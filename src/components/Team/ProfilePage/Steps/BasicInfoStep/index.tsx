import useAcademicInfoStep from 'components/Team/hooks/useAcademicInfoStep';
import DeptSelect from 'components/Team/ProfilePage/components/DeptSelect';
import FormField from 'components/Team/ProfilePage/components/FormField';
import StepIndicator from 'components/Team/ProfilePage/components/StepIndicator';
import { PROFILE_STEPS, type ProfileFormValues, type TeamProfileFormMode } from 'components/Team/ProfilePage/types';
import { Controller, useFormContext, useFormState, useWatch } from 'react-hook-form';
import styles from './BasicInfoStep.module.scss';

interface BasicInfoStepProps {
  mode: TeamProfileFormMode;
  onNext: () => void;
}

const LOGGING_TITLE: Record<TeamProfileFormMode, { LOAD_USER_INFO: string; MAJOR_SELECT: string; NEXT: string }> = {
  create: {
    LOAD_USER_INFO: 'team_recruitment_profile_create_load',
    MAJOR_SELECT: 'team_recruitment_profile_create_major',
    NEXT: 'team_recruitment_profile_create_next',
  },
  edit: {
    LOAD_USER_INFO: 'team_recruitment_profile_modify_load',
    MAJOR_SELECT: 'team_recruitment_profile_modify_major_select',
    NEXT: 'team_recruitment_profile_modify_next',
  },
};

export default function BasicInfoStep({ mode, onNext }: BasicInfoStepProps) {
  const { control, register, trigger, getValues } = useFormContext<ProfileFormValues>();
  const { errors } = useFormState({ control });

  const loggingTitle = LOGGING_TITLE[mode];

  const nickname = useWatch({ control, name: 'nickname' }) ?? '';

  const { deptOptionList, isLoadingUserInfo, isSaving, handleLoadUserInfo, handleSaveAcademicInfo, handleMajorSelect } =
    useAcademicInfoStep(loggingTitle, onNext);

  const handleNext = async () => {
    const isValid = await trigger(['nickname', 'department', 'studentNumber']);
    if (!isValid) return;

    const { department, studentNumber } = getValues();
    handleSaveAcademicInfo({ department, studentNumber });
  };

  return (
    <div className={styles.step}>
      <div className={styles.step__fields}>
        <StepIndicator steps={PROFILE_STEPS} currentIndex={0} />

        <div className={styles.step__body}>
          <div className={styles.loadInfo}>
            <div className={styles.loadInfo__head}>
              <span className={styles.loadInfo__title}>
                <span className={styles['loadInfo__title--highlight']}>코인</span> 회원정보 불러오기
              </span>
              <span className={styles.loadInfo__description}>닉네임, 학과(학부), 학번</span>
            </div>
            <button
              type="button"
              className={styles.loadInfo__button}
              onClick={handleLoadUserInfo}
              disabled={isLoadingUserInfo}
            >
              회원정보 불러오기
            </button>
          </div>

          <FormField
            label="닉네임"
            required
            maxLength={20}
            currentLength={nickname.length}
            error={errors.nickname?.message}
          >
            {({ controlId, controlClassName, ariaDescribedBy, ariaInvalid }) => (
              <input
                id={controlId}
                type="text"
                className={controlClassName}
                placeholder="닉네임을 입력해주세요."
                maxLength={20}
                aria-describedby={ariaDescribedBy}
                aria-invalid={ariaInvalid}
                {...register('nickname', {
                  required: '닉네임을 입력해주세요.',
                  maxLength: { value: 20, message: '닉네임은 20자 이내로 입력해주세요.' },
                })}
              />
            )}
          </FormField>

          <FormField label="학과 · 학부" required error={errors.department?.message}>
            {({ controlId, ariaDescribedBy }) => (
              <Controller
                control={control}
                name="department"
                rules={{ required: '학과 · 학부를 선택해주세요.' }}
                render={({ field }) => (
                  <DeptSelect
                    id={controlId}
                    options={deptOptionList}
                    value={field.value || null}
                    placeholder="학과 · 학부를 선택해주세요."
                    onChange={(event) => {
                      field.onChange(event.target.value);
                      handleMajorSelect(event.target.value);
                    }}
                    disabled={isSaving}
                    ariaDescribedBy={ariaDescribedBy}
                  />
                )}
              />
            )}
          </FormField>

          <FormField label="학번" required error={errors.studentNumber?.message}>
            {({ controlId, controlClassName, ariaDescribedBy, ariaInvalid }) => (
              <input
                id={controlId}
                type="text"
                inputMode="numeric"
                className={controlClassName}
                placeholder="학번을 작성해주세요."
                maxLength={10}
                disabled={isSaving}
                aria-describedby={ariaDescribedBy}
                aria-invalid={ariaInvalid}
                {...register('studentNumber', { required: '학번을 작성해주세요.' })}
              />
            )}
          </FormField>
        </div>
      </div>

      <div className={styles.step__footer}>
        <button type="button" className={styles.step__submit} onClick={handleNext} disabled={isSaving}>
          다음
        </button>
      </div>
    </div>
  );
}
