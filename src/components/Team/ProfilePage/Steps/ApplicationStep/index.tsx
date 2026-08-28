import FormField from 'components/Team/ProfilePage/components/FormField';
import StepIndicator from 'components/Team/ProfilePage/components/StepIndicator';
import TagInput from 'components/Team/ProfilePage/components/TagInput';
import { PROFILE_STEPS, type ProfileFormValues } from 'components/Team/ProfilePage/types';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';
import useLogger from 'utils/hooks/analytics/useLogger';
import ActivityHistoryField from './ActivityHistoryField';
import styles from './ApplicationStep.module.scss';

interface ApplicationStepProps {
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const loggingTitle = {
  SKILL_ADD: 'team_profile_skill_add',
  SKILL_REMOVE: 'team_profile_skill_remove',
  SAVE: 'team_profile_save',
};

export default function ApplicationStep({ onBack, onSubmit, isSubmitting }: ApplicationStepProps) {
  const { actionEventClick } = useLogger();
  const { control, register } = useFormContext<ProfileFormValues>();
  const { errors } = useFormState({ control });

  const preferredRole = useWatch({ control, name: 'preferredRole' }) ?? '';
  const introduction = useWatch({ control, name: 'introduction' }) ?? '';

  const handleSave = () => {
    // TODO: 팀원모집 도메인 로깅 team 값 컨벤션 확인 필요
    actionEventClick({ team: 'TEAM', event_category: 'click', event_label: loggingTitle.SAVE, value: '저장' });
    onSubmit();
  };

  return (
    <div className={styles.step}>
      <StepIndicator steps={PROFILE_STEPS} currentIndex={1} />

      <div className={styles.step__body}>
        <FormField
          label="선호 역할"
          required
          maxLength={20}
          currentLength={preferredRole.length}
          error={errors.preferredRole?.message}
        >
          {(controlClassName) => (
            <input
              type="text"
              className={controlClassName}
              placeholder="선호 역할을 작성해주세요. ex) 프론트엔드, 디자인 등"
              maxLength={20}
              {...register('preferredRole', {
                required: '선호 역할을 작성해주세요.',
                maxLength: { value: 20, message: '선호 역할은 20자 이내로 입력해주세요.' },
              })}
            />
          )}
        </FormField>

        <TagInput
          label="보유기술 / 자격증"
          description="기술 / 자격증은 항목별로 하나씩 작성해주세요."
          addButtonLabel="기술 / 자격증 추가"
          placeholder="기술 / 자격증을 작성해주세요."
          onAppend={() =>
            // TODO: 팀원모집 도메인 로깅 team 값 컨벤션 확인 필요
            actionEventClick({
              team: 'TEAM',
              event_category: 'click',
              event_label: loggingTitle.SKILL_ADD,
              value: '기술 / 자격증 추가',
            })
          }
          onRemove={(value) =>
            // TODO: 팀원모집 도메인 로깅 team 값 컨벤션 확인 필요
            actionEventClick({
              team: 'TEAM',
              event_category: 'click',
              event_label: loggingTitle.SKILL_REMOVE,
              value,
            })
          }
        />

        <ActivityHistoryField />

        <FormField
          label="자기소개"
          required
          maxLength={1000}
          currentLength={introduction.length}
          error={errors.introduction?.message}
        >
          {(controlClassName) => (
            <textarea
              className={controlClassName}
              placeholder="자기소개를 작성해주세요."
              maxLength={1000}
              rows={6}
              {...register('introduction', {
                required: '자기소개를 작성해주세요.',
                maxLength: { value: 1000, message: '자기소개는 1000자 이내로 입력해주세요.' },
              })}
            />
          )}
        </FormField>
      </div>

      <div className={styles.step__footer}>
        <button type="button" className={styles.step__back} onClick={onBack}>
          이전
        </button>
        <button type="button" className={styles.step__submit} onClick={handleSave} disabled={isSubmitting}>
          저장
        </button>
      </div>
    </div>
  );
}
