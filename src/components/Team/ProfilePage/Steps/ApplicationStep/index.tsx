import FormField from 'components/Team/ProfilePage/components/FormField';
import StepIndicator from 'components/Team/ProfilePage/components/StepIndicator';
import TagInput from 'components/Team/ProfilePage/components/TagInput';
import { PROFILE_LOG_MODE } from 'components/Team/ProfilePage/constants';
import { PROFILE_STEPS, type ProfileFormValues, type TeamProfileFormMode } from 'components/Team/ProfilePage/types';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';
import useLogger from 'utils/hooks/analytics/useLogger';
import ActivityHistoryField from './ActivityHistoryField';
import styles from './ApplicationStep.module.scss';

interface ApplicationStepProps {
  mode: TeamProfileFormMode;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export default function ApplicationStep({ mode, onBack, onSubmit, isSubmitting, submitLabel }: ApplicationStepProps) {
  const { actionEventClick } = useLogger();
  const { control, register } = useFormContext<ProfileFormValues>();
  const { errors } = useFormState({ control });
  const logMode = PROFILE_LOG_MODE[mode];

  const preferredRole = useWatch({ control, name: 'preferredRole' }) ?? '';
  const introduction = useWatch({ control, name: 'introduction' }) ?? '';

  const handleSave = () => {
    actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: `team_recruitment_profile_${logMode}_submit`,
      value: submitLabel,
    });
    onSubmit();
  };

  return (
    <div className={styles.step}>
      <div className={styles.step__fields}>
        <StepIndicator steps={PROFILE_STEPS} currentIndex={1} />

        <div className={styles.step__body}>
        <FormField
          label="선호 역할"
          required
          maxLength={20}
          currentLength={preferredRole.length}
          error={errors.preferredRole?.message}
        >
          {({ controlId, controlClassName, ariaDescribedBy, ariaInvalid }) => (
            <input
              id={controlId}
              type="text"
              className={controlClassName}
              placeholder="선호 역할을 작성해주세요. ex) 프론트엔드, 디자인 등"
              maxLength={20}
              aria-describedby={ariaDescribedBy}
              aria-invalid={ariaInvalid}
              {...register('preferredRole')}
            />
          )}
        </FormField>

        <TagInput
          mode={mode}
          label="보유기술 / 자격증"
          description="기술 / 자격증은 항목별로 하나씩 작성해주세요."
          addButtonLabel="기술 / 자격증 추가"
          placeholder="기술 / 자격증을 작성해주세요."
          onAppend={() =>
            actionEventClick({
              team: 'CAMPUS',
              event_category: 'click',
              event_label: `team_recruitment_profile_${logMode}_skill_add`,
              value: '기술 / 자격증 추가',
            })
          }
        />

        <ActivityHistoryField mode={mode} />

        <FormField
          label="자기소개"
          required
          maxLength={1000}
          currentLength={introduction.length}
          error={errors.introduction?.message}
        >
          {({ controlId, controlClassName, ariaDescribedBy, ariaInvalid }) => {
            const { ref: introductionRef, ...introductionField } = register('introduction');
            return (
              <textarea
                id={controlId}
                className={controlClassName}
                placeholder="자기소개를 작성해주세요."
                maxLength={1000}
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
        <button type="button" className={styles.step__back} onClick={onBack}>
          이전
        </button>
        <button type="button" className={styles.step__submit} onClick={handleSave} disabled={isSubmitting}>
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
