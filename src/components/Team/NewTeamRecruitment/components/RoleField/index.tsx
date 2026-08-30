import { cn } from '@bcsdlab/utils';
import MinusIcon from 'assets/svg/Team/minus-sign.svg';
import PlusIcon from 'assets/svg/Team/plus.svg';
import DeleteIcon from 'assets/svg/Team/x.svg';
import {
  TEAM_RECRUITMENT_MAX_MEMBER_COUNT,
  TEAM_RECRUITMENT_MAX_ROLE_COUNT,
  TEAM_RECRUITMENT_ROLE_NAME_MAX_LENGTH,
} from 'components/Team/NewTeamRecruitment/constants';
import { TeamRecruitmentFormValues } from 'components/Team/NewTeamRecruitment/schema';
import { Control, Controller, useFieldArray, useWatch } from 'react-hook-form';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './RoleField.module.scss';

interface RoleFieldProps {
  control: Control<TeamRecruitmentFormValues>;
}

export default function RoleField({ control }: RoleFieldProps) {
  const logger = useLogger();
  const { fields, append, remove } = useFieldArray({ control, name: 'roles', keyName: 'fieldId' });
  const isRoleUnified = useWatch({ control, name: 'isRoleUnified' });
  const roles = useWatch({ control, name: 'roles' });
  const totalMemberCount = roles.reduce((sum, role) => sum + role.memberCount, 0);
  const isAddDisabled = isRoleUnified || fields.length >= TEAM_RECRUITMENT_MAX_ROLE_COUNT;

  const handleAddRole = () => {
    if (isAddDisabled) return;
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'team_recruitment_recruit_role', value: '역할 추가' });
    append({ name: '', memberCount: 1 });
  };

  return (
    <div className={styles.field}>
      <div className={styles.field__header}>
        <div className={styles.field__title}>
          모집 인원 및 역할 <span className={styles['field__title-required']}>*</span>
          {!isRoleUnified && (
            <span className={styles['field__title-counter']}>
              {fields.length}/{TEAM_RECRUITMENT_MAX_ROLE_COUNT}
            </span>
          )}
        </div>
        <button
          type="button"
          className={styles['field__add-button']}
          onClick={handleAddRole}
          disabled={isAddDisabled}
        >
          역할 추가
          <PlusIcon />
        </button>
      </div>
      <p className={styles.field__description}>역할을 추가하고 필요한 인원을 선택해주세요</p>

      <Controller
        control={control}
        name="isRoleUnified"
        render={({ field }) => (
          <label className={styles.field__checkbox}>
            <input
              type="checkbox"
              checked={field.value}
              onChange={() => {
                logger.actionEventClick({
                  team: 'CAMPUS',
                  event_label: 'team_recruitment_recruit_role',
                  value: '역할 구분 없이 모집하기',
                });
                field.onChange(!field.value);
              }}
            />
            <span className={styles['field__checkbox-indicator']} aria-hidden="true" />
            역할 구분 없이 모집하기
          </label>
        )}
      />

      {isRoleUnified ? (
        <Controller
          control={control}
          name="unifiedMemberCount"
          render={({ field }) => (
            <div className={cn({ [styles.field__stepper]: true, [styles['field__stepper--full']]: true })}>
              <button
                type="button"
                aria-label="인원수 감소"
                disabled={field.value <= 1}
                onClick={() => field.onChange(Math.max(1, field.value - 1))}
              >
                <MinusIcon />
              </button>
              <span>{field.value}</span>
              <button
                type="button"
                aria-label="인원수 증가"
                disabled={field.value >= TEAM_RECRUITMENT_MAX_MEMBER_COUNT}
                onClick={() => field.onChange(field.value + 1)}
              >
                <PlusIcon />
              </button>
            </div>
          )}
        />
      ) : (
        fields.map((roleField, index) => (
          <div key={roleField.fieldId} className={styles.field__row}>
            <Controller
              control={control}
              name={`roles.${index}.name`}
              render={({ field }) => (
                <div className={styles['field__row-name']}>
                  <input
                    type="text"
                    value={field.value}
                    placeholder="역할명"
                    maxLength={TEAM_RECRUITMENT_ROLE_NAME_MAX_LENGTH}
                    onChange={field.onChange}
                  />
                  <span>
                    {field.value.length}/{TEAM_RECRUITMENT_ROLE_NAME_MAX_LENGTH}
                  </span>
                </div>
              )}
            />
            <Controller
              control={control}
              name={`roles.${index}.memberCount`}
              render={({ field }) => (
                <div className={styles.field__stepper}>
                  <button
                    type="button"
                    aria-label="인원수 감소"
                    disabled={field.value <= 1}
                    onClick={() => field.onChange(Math.max(1, field.value - 1))}
                  >
                    <MinusIcon />
                  </button>
                  <span>{field.value}</span>
                  <button
                    type="button"
                    aria-label="인원수 증가"
                    disabled={totalMemberCount >= TEAM_RECRUITMENT_MAX_MEMBER_COUNT}
                    onClick={() => field.onChange(field.value + 1)}
                  >
                    <PlusIcon />
                  </button>
                </div>
              )}
            />
            <button
              type="button"
              className={styles['field__row-delete']}
              aria-label="역할 삭제"
              onClick={() => remove(index)}
            >
              <DeleteIcon />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
