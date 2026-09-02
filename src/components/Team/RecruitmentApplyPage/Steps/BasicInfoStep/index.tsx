import { cn } from '@bcsdlab/utils';
import useAcademicInfoStep from 'components/Team/hooks/useAcademicInfoStep';
import DeptSelect from 'components/Team/ProfilePage/components/DeptSelect';
import FormField from 'components/Team/ProfilePage/components/FormField';
import StepIndicator from 'components/Team/ProfilePage/components/StepIndicator';
import ActivityHistoryField from 'components/Team/RecruitmentApplyPage/components/ActivityHistoryField';
import SkillTagInput from 'components/Team/RecruitmentApplyPage/components/SkillTagInput';
import {
  APPLY_INTRODUCTION_MAX_LENGTH,
  APPLY_NICKNAME_MAX_LENGTH,
  APPLY_PREFERRED_ROLE_MAX_LENGTH,
} from 'components/Team/RecruitmentApplyPage/schema';
import { APPLY_STEPS } from 'components/Team/RecruitmentApplyPage/types';
import { Controller, useFormContext, useFormState, useWatch } from 'react-hook-form';
import useLogger from 'utils/hooks/analytics/useLogger';
import showToast from 'utils/ts/showToast';
import type { ApplicationFormValues } from 'components/Team/RecruitmentApplyPage/types';
import styles from './BasicInfoStep.module.scss';

interface BasicInfoStepProps {
  onNext: () => void;
}

const LOGGING_TITLE = {
  LOAD_USER_INFO: 'team_recruitment_apply_load',
  MAJOR_SELECT: 'team_recruitment_apply_major_select',
  SKILL_ADD: 'team_recruitment_apply_skill_add',
  NEXT: 'team_recruitment_apply_next',
};

export default function BasicInfoStep({ onNext }: BasicInfoStepProps) {
  const { actionEventClick } = useLogger();
  const { control, register, trigger, getValues } = useFormContext<ApplicationFormValues>();
  const { errors } = useFormState({ control });

  const nickname = useWatch({ control, name: 'nickname' }) ?? '';
  const preferredRole = useWatch({ control, name: 'preferredRole' }) ?? '';
  const introduction = useWatch({ control, name: 'introduction' }) ?? '';

  const { deptOptionList, isLoadingUserInfo, isSaving, handleLoadUserInfo, handleSaveAcademicInfo, handleMajorSelect } =
    useAcademicInfoStep(LOGGING_TITLE, onNext);

  const handleNext = async () => {
    const activities = getValues('activities');
    if (activities.some((activity) => activity.status === 'draft')) {
      showToast('warning', '작성 중인 활동 이력을 완료해주세요.');
      return;
    }

    const isValid = await trigger([
      'nickname',
      'department',
      'studentNumber',
      'preferredRole',
      'skills',
      'activities',
      'introduction',
    ]);
    if (!isValid) {
      showToast('warning', '필수 항목을 모두 작성해주세요.');
      return;
    }

    const { department, studentNumber } = getValues();
    handleSaveAcademicInfo({ department, studentNumber });
  };

  return (
    <div className={styles.step}>
      <div className={styles.step__fields}>
        <StepIndicator steps={APPLY_STEPS} currentIndex={0} />

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
            maxLength={APPLY_NICKNAME_MAX_LENGTH}
            currentLength={nickname.length}
            error={errors.nickname?.message}
          >
            {({ controlId, controlClassName, ariaDescribedBy, ariaInvalid }) => (
              <input
                id={controlId}
                type="text"
                className={cn({ [controlClassName]: true, [styles.grayInput]: true })}
                placeholder="닉네임을 입력해주세요."
                maxLength={APPLY_NICKNAME_MAX_LENGTH}
                aria-describedby={ariaDescribedBy}
                aria-invalid={ariaInvalid}
                {...register('nickname')}
              />
            )}
          </FormField>

          <FormField label="학과 · 학부" required error={errors.department?.message}>
            {({ controlId, ariaDescribedBy }) => (
              <Controller
                control={control}
                name="department"
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
                    className={styles.grayDropdown}
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
                className={cn({ [controlClassName]: true, [styles.grayInput]: true })}
                placeholder="학번을 작성해주세요."
                maxLength={10}
                disabled={isSaving}
                aria-describedby={ariaDescribedBy}
                aria-invalid={ariaInvalid}
                {...register('studentNumber')}
              />
            )}
          </FormField>

          <FormField
            label="선호 역할"
            required
            maxLength={APPLY_PREFERRED_ROLE_MAX_LENGTH}
            currentLength={preferredRole.length}
            error={errors.preferredRole?.message}
          >
            {({ controlId, controlClassName, ariaDescribedBy, ariaInvalid }) => (
              <input
                id={controlId}
                type="text"
                className={controlClassName}
                placeholder="선호 역할을 작성해주세요. ex) 프론트엔드, 기획, 디자인 등"
                maxLength={APPLY_PREFERRED_ROLE_MAX_LENGTH}
                aria-describedby={ariaDescribedBy}
                aria-invalid={ariaInvalid}
                {...register('preferredRole')}
              />
            )}
          </FormField>
        </div>

        <div className={styles.step__extra}>
          <SkillTagInput
            label="보유기술 / 자격증"
            description="기술 / 자격증은 항목별로 하나씩 작성해주세요."
            addButtonLabel="기술 / 자격증 추가"
            placeholder="기술 / 자격증을 작성해주세요."
            error={errors.skills?.message}
            onAppend={() =>
              actionEventClick({
                team: 'CAMPUS',
                event_category: 'click',
                event_label: LOGGING_TITLE.SKILL_ADD,
                value: '기술 / 자격증 추가',
              })
            }
          />

          <ActivityHistoryField />

          <FormField
            label="자기소개"
            required
            maxLength={APPLY_INTRODUCTION_MAX_LENGTH}
            currentLength={introduction.length}
            error={errors.introduction?.message}
          >
            {({ controlId, controlClassName, ariaDescribedBy, ariaInvalid }) => {
              const { ref: introductionRef, ...introductionField } = register('introduction');
              return (
                <textarea
                  id={controlId}
                  className={cn({
                    [controlClassName]: true,
                    [styles.grayInput]: true,
                    [styles.introductionControl]: true,
                  })}
                  placeholder="자기소개를 작성해주세요."
                  maxLength={APPLY_INTRODUCTION_MAX_LENGTH}
                  rows={6}
                  aria-describedby={ariaDescribedBy}
                  aria-invalid={ariaInvalid}
                  ref={(el) => {
                    introductionRef(el);
                    if (el) {
                      el.style.height = 'auto';
                      el.style.height = `${el.scrollHeight}px`;
                    }
                  }}
                  onInput={(e) => {
                    const el = e.currentTarget;
                    el.style.height = 'auto';
                    el.style.height = `${el.scrollHeight}px`;
                  }}
                  {...introductionField}
                />
              );
            }}
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
