import { cn } from '@bcsdlab/utils';
import FormField from 'components/Team/ProfilePage/components/FormField';
import StepIndicator from 'components/Team/ProfilePage/components/StepIndicator';
import {
  APPLY_AVAILABILITY_MAX_LENGTH,
  APPLY_MOTIVATION_MAX_LENGTH,
} from 'components/Team/RecruitmentApplyPage/schema';
import { APPLY_STEPS } from 'components/Team/RecruitmentApplyPage/types';
import { Controller, useFormContext, useFormState, useWatch } from 'react-hook-form';
import useLogger from 'utils/hooks/analytics/useLogger';
import type { TeamRecruitmentRole } from 'api/team/entity';
import type { ApplicationFormValues } from 'components/Team/RecruitmentApplyPage/types';
import styles from './ApplicationStep.module.scss';

interface ApplicationStepProps {
  roles: TeamRecruitmentRole[];
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const LOGGING_TITLE = {
  ROLE_SELECT: 'team_recruitment_apply_role_select',
  SUBMIT: 'team_recruitment_apply_submit',
};

export default function ApplicationStep({ roles, onBack, onSubmit, isSubmitting }: ApplicationStepProps) {
  const { actionEventClick } = useLogger();
  const { control, register } = useFormContext<ApplicationFormValues>();
  const { errors } = useFormState({ control });

  const motivation = useWatch({ control, name: 'motivation' }) ?? '';
  const availability = useWatch({ control, name: 'availability' }) ?? '';

  const handleSubmitClick = () => {
    actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: LOGGING_TITLE.SUBMIT,
      value: '지원하기',
    });
    onSubmit();
  };

  const hasRoles = roles.length > 0;

  return (
    <div className={styles.step}>
      <div className={styles.step__fields}>
        <StepIndicator steps={APPLY_STEPS} currentIndex={1} />

        <div className={cn({ [styles.step__body]: true, [styles['step__body--noRoles']]: !hasRoles })}>
        {hasRoles && (
          <div className={styles.roles}>
            <div className={styles.roles__head}>
              <span className={styles.roles__label}>
                지원 역할<span className={styles.roles__required}>*</span>
              </span>
            </div>

            <Controller
              control={control}
              name="roleId"
              render={({ field }) => (
                <ul className={styles.roles__list}>
                  {roles.map((role) => (
                    <li key={role.id}>
                      <label
                        className={cn({
                          [styles.roleOption]: true,
                          [styles['roleOption--selected']]: field.value === role.id,
                          [styles['roleOption--closed']]: role.is_closed,
                        })}
                      >
                        <input
                          type="radio"
                          className={styles.roleOption__input}
                          name={field.name}
                          value={role.id}
                          checked={field.value === role.id}
                          disabled={role.is_closed}
                          onBlur={field.onBlur}
                          onChange={() => {
                            field.onChange(role.id);
                            actionEventClick({
                              team: 'CAMPUS',
                              event_category: 'click',
                              event_label: LOGGING_TITLE.ROLE_SELECT,
                              value: role.name,
                            });
                          }}
                        />
                        <span className={styles.roleOption__icon} aria-hidden />
                        <span className={styles.roleOption__name}>{role.name}</span>
                        <span className={styles.roleOption__count}>
                          {role.is_closed ? '모집 마감' : `${role.current_participants}/${role.max_participants}명`}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            />

            {errors.roleId?.message && <p className={styles.roles__error}>{errors.roleId.message}</p>}
          </div>
        )}

        <FormField
          label="지원 동기"
          required
          maxLength={APPLY_MOTIVATION_MAX_LENGTH}
          currentLength={motivation.length}
          error={errors.motivation?.message}
        >
          {({ controlId, controlClassName, ariaDescribedBy, ariaInvalid }) => {
            const { ref: motivationRef, ...motivationField } = register('motivation');
            return (
              <textarea
                id={controlId}
                className={controlClassName}
                placeholder="지원 동기를 작성해주세요."
                maxLength={APPLY_MOTIVATION_MAX_LENGTH}
                rows={6}
                aria-describedby={ariaDescribedBy}
                aria-invalid={ariaInvalid}
                ref={(el) => {
                  motivationRef(el);
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
                {...motivationField}
              />
            );
          }}
        </FormField>

        <FormField
          label="참여 가능 시간"
          required
          maxLength={APPLY_AVAILABILITY_MAX_LENGTH}
          currentLength={availability.length}
          error={errors.availability?.message}
        >
          {({ controlId, controlClassName, ariaDescribedBy, ariaInvalid }) => (
            <textarea
              id={controlId}
              className={cn({ [controlClassName]: true, [styles.availabilityControl]: true })}
              placeholder="참여 가능한 시간을 작성해주세요."
              maxLength={APPLY_AVAILABILITY_MAX_LENGTH}
              aria-describedby={ariaDescribedBy}
              aria-invalid={ariaInvalid}
              {...register('availability')}
            />
          )}
        </FormField>
        </div>
      </div>

      <div className={styles.step__footer}>
        <button type="button" className={styles.step__back} onClick={onBack}>
          이전
        </button>
        <button type="button" className={styles.step__submit} onClick={handleSubmitClick} disabled={isSubmitting}>
          지원하기
        </button>
      </div>
    </div>
  );
}
