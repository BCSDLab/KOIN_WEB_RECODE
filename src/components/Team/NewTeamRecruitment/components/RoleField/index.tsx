import { cn } from '@bcsdlab/utils';
import MinusIcon from 'assets/svg/Team/minus-sign.svg';
import PlusIcon from 'assets/svg/Team/plus.svg';
import DeleteIcon from 'assets/svg/Team/x.svg';
import {
  TEAM_RECRUITMENT_MAX_ROLE_COUNT,
  TEAM_RECRUITMENT_ROLE_NAME_MAX_LENGTH,
} from 'components/Team/NewTeamRecruitment/constants';
import { TeamRecruitmentRole } from 'components/Team/NewTeamRecruitment/types';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './RoleField.module.scss';

interface RoleFieldProps {
  roles: TeamRecruitmentRole[];
  isRoleUnified: boolean;
  unifiedMemberCount: number;
  onAddRole: () => void;
  onRemoveRole: (id: string) => void;
  onRoleNameChange: (id: string, name: string) => void;
  onRoleMemberCountChange: (id: string, memberCount: number) => void;
  onUnifiedToggle: () => void;
  onUnifiedMemberCountChange: (memberCount: number) => void;
}

export default function RoleField({
  roles,
  isRoleUnified,
  unifiedMemberCount,
  onAddRole,
  onRemoveRole,
  onRoleNameChange,
  onRoleMemberCountChange,
  onUnifiedToggle,
  onUnifiedMemberCountChange,
}: RoleFieldProps) {
  const logger = useLogger();
  const isAddDisabled = isRoleUnified || roles.length >= TEAM_RECRUITMENT_MAX_ROLE_COUNT;

  const handleAddRole = () => {
    if (isAddDisabled) return;
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'team_recruitment_recruit_role', value: '역할 추가' });
    onAddRole();
  };

  const handleUnifiedToggle = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_recruit_role',
      value: '역할 구분 없이 모집하기',
    });
    onUnifiedToggle();
  };

  return (
    <div className={styles.field}>
      <div className={styles.field__header}>
        <div className={styles.field__title}>
          모집 인원 및 역할 <span className={styles['field__title-required']}>*</span>
          {!isRoleUnified && (
            <span className={styles['field__title-counter']}>
              {roles.length}/{TEAM_RECRUITMENT_MAX_ROLE_COUNT}
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

      <label className={styles.field__checkbox}>
        <input type="checkbox" checked={isRoleUnified} onChange={handleUnifiedToggle} />
        <span className={styles['field__checkbox-indicator']} aria-hidden="true" />
        역할 구분 없이 모집하기
      </label>

      {isRoleUnified ? (
        <div className={cn({ [styles.field__stepper]: true, [styles['field__stepper--full']]: true })}>
          <button
            type="button"
            aria-label="인원수 감소"
            disabled={unifiedMemberCount <= 1}
            onClick={() => onUnifiedMemberCountChange(Math.max(1, unifiedMemberCount - 1))}
          >
            <MinusIcon />
          </button>
          <span>{unifiedMemberCount}</span>
          <button
            type="button"
            aria-label="인원수 증가"
            onClick={() => onUnifiedMemberCountChange(unifiedMemberCount + 1)}
          >
            <PlusIcon />
          </button>
        </div>
      ) : (
        roles.map((role) => (
          <div key={role.id} className={styles.field__row}>
            <div className={cn({ [styles['field__row-name']]: true })}>
              <input
                type="text"
                value={role.name}
                placeholder="역할명"
                maxLength={TEAM_RECRUITMENT_ROLE_NAME_MAX_LENGTH}
                onChange={(e) => onRoleNameChange(role.id, e.target.value)}
              />
              <span>
                {role.name.length}/{TEAM_RECRUITMENT_ROLE_NAME_MAX_LENGTH}
              </span>
            </div>
            <div className={styles.field__stepper}>
              <button
                type="button"
                aria-label="인원수 감소"
                disabled={role.memberCount <= 1}
                onClick={() => onRoleMemberCountChange(role.id, Math.max(1, role.memberCount - 1))}
              >
                <MinusIcon />
              </button>
              <span>{role.memberCount}</span>
              <button
                type="button"
                aria-label="인원수 증가"
                onClick={() => onRoleMemberCountChange(role.id, role.memberCount + 1)}
              >
                <PlusIcon />
              </button>
            </div>
            <button
              type="button"
              className={styles['field__row-delete']}
              aria-label="역할 삭제"
              onClick={() => onRemoveRole(role.id)}
            >
              <DeleteIcon />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
