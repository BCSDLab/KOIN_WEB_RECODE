import { ComponentType } from 'react';
import { cn } from '@bcsdlab/utils';
import ComputerIcon from 'assets/svg/Team/computer.svg';
import KeyframesDoubleIcon from 'assets/svg/Team/keyframes-double.svg';
import UserGroupIcon from 'assets/svg/Team/user-group-02.svg';
import SubPageHeader from 'components/ui/SubPageHeader';
import useLogger from 'utils/hooks/analytics/useLogger';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import CategoryField from './components/CategoryField';
import ConfirmModal from './components/ConfirmModal';
import RoleField from './components/RoleField';
import ScheduleField from './components/ScheduleField';
import {
  TEAM_RECRUITMENT_DESCRIPTION_MAX_LENGTH,
  TEAM_RECRUITMENT_PROGRESS_TYPE_LABEL,
  TEAM_RECRUITMENT_QUALIFICATION_MAX_LENGTH,
  TEAM_RECRUITMENT_TITLE_MAX_LENGTH,
} from './constants';
import useTeamRecruitmentForm from './hooks/useTeamRecruitmentForm';
import { TeamRecruitmentProgressType } from './types';
import styles from './NewTeamRecruitment.module.scss';

const PROGRESS_TYPE_ICON: Record<TeamRecruitmentProgressType, ComponentType> = {
  ONLINE: ComputerIcon,
  OFFLINE: UserGroupIcon,
  HYBRID: KeyframesDoubleIcon,
};

export default function NewTeamRecruitment() {
  const logger = useLogger();
  const {
    formData,
    isFormValid,
    setCategory,
    setTitle,
    setProgressType,
    setActivityStartDate,
    setActivityEndDate,
    setDeadlineDate,
    setDescription,
    setRelatedUrl,
    setQualification,
    addRole,
    removeRole,
    setRoleName,
    setRoleMemberCount,
    toggleRoleUnified,
    setUnifiedMemberCount,
  } = useTeamRecruitmentForm();

  const [isConfirmModalOpen, openConfirmModal, closeConfirmModal] = useBooleanState(false);

  const handleSubmitClick = () => {
    if (!isFormValid) return;
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'team_recruitment_recruit_submit', value: '등록하기' });
    openConfirmModal();
  };

  const handleCancelConfirm = () => {
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'team_recruitment_recruit_submit_cancel', value: '취소하기' });
    closeConfirmModal();
  };

  const handleConfirmRegister = () => {
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'team_recruitment_recruit_submit_confirm', value: '등록하기' });
    // To Do: API 연결
    closeConfirmModal();
  };

  return (
    <div className={styles.page}>
      <SubPageHeader title="모집글 작성" />

      <div className={styles.form}>
        <CategoryField value={formData.category} onChange={setCategory} />

        <div className={styles.form__item}>
          <div className={styles['form__item-header']}>
            <label className={styles.form__label} htmlFor="team-recruitment-title">
              제목 <span className={styles['form__label-required']}>*</span>
            </label>
            <span className={styles.form__counter}>
              {formData.title.length}/{TEAM_RECRUITMENT_TITLE_MAX_LENGTH}
            </span>
          </div>
          <input
            id="team-recruitment-title"
            type="text"
            className={styles.form__input}
            placeholder="제목을 입력해주세요."
            value={formData.title}
            maxLength={TEAM_RECRUITMENT_TITLE_MAX_LENGTH}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.form__item}>
          <div className={styles.form__label}>
            진행방식 <span className={styles['form__label-required']}>*</span>
          </div>
          <div className={styles['progress-type']}>
            {(Object.keys(TEAM_RECRUITMENT_PROGRESS_TYPE_LABEL) as TeamRecruitmentProgressType[]).map((type) => {
              const Icon = PROGRESS_TYPE_ICON[type];
              const isSelected = formData.progressType === type;
              return (
                <button
                  key={type}
                  type="button"
                  className={cn({
                    [styles['progress-type__button']]: true,
                    [styles['progress-type__button--selected']]: isSelected,
                  })}
                  onClick={() => {
                    logger.actionEventClick({
                      team: 'CAMPUS',
                      event_label: 'team_recruitment_recruit_method',
                      value: TEAM_RECRUITMENT_PROGRESS_TYPE_LABEL[type],
                    });
                    setProgressType(type);
                  }}
                >
                  <Icon />
                  {TEAM_RECRUITMENT_PROGRESS_TYPE_LABEL[type]}
                </button>
              );
            })}
          </div>
        </div>

        <ScheduleField
          activityStartDate={formData.activityStartDate}
          activityEndDate={formData.activityEndDate}
          deadlineDate={formData.deadlineDate}
          onActivityStartDateChange={setActivityStartDate}
          onActivityEndDateChange={setActivityEndDate}
          onDeadlineDateChange={setDeadlineDate}
        />

        <RoleField
          roles={formData.roles}
          isRoleUnified={formData.isRoleUnified}
          unifiedMemberCount={formData.unifiedMemberCount}
          onAddRole={addRole}
          onRemoveRole={removeRole}
          onRoleNameChange={setRoleName}
          onRoleMemberCountChange={setRoleMemberCount}
          onUnifiedToggle={toggleRoleUnified}
          onUnifiedMemberCountChange={setUnifiedMemberCount}
        />

        <div className={styles.form__item}>
          <div className={styles['form__item-header']}>
            <label className={styles.form__label} htmlFor="team-recruitment-description">
              모집 소개 <span className={styles['form__label-required']}>*</span>
            </label>
            <span className={styles.form__counter}>
              {formData.description.length}/{TEAM_RECRUITMENT_DESCRIPTION_MAX_LENGTH}
            </span>
          </div>
          <textarea
            id="team-recruitment-description"
            className={styles.form__textarea}
            placeholder="소개를 작성해주세요."
            value={formData.description}
            maxLength={TEAM_RECRUITMENT_DESCRIPTION_MAX_LENGTH}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.form__item}>
          <label className={styles.form__label} htmlFor="team-recruitment-url">
            관련 URL
          </label>
          <input
            id="team-recruitment-url"
            type="text"
            className={styles.form__input}
            placeholder="공모전/대외활동 등 모집글 관련 URL을 작성해주세요."
            value={formData.relatedUrl}
            onChange={(e) => setRelatedUrl(e.target.value)}
          />
        </div>

        <div className={styles.form__item}>
          <div className={styles['form__item-header']}>
            <label className={styles.form__label} htmlFor="team-recruitment-qualification">
              지원 자격
            </label>
            <span className={styles.form__counter}>
              {formData.qualification.length}/{TEAM_RECRUITMENT_QUALIFICATION_MAX_LENGTH}
            </span>
          </div>
          <textarea
            id="team-recruitment-qualification"
            className={styles.form__textarea}
            placeholder="지원 자격 또는 우대사항을 작성해주세요."
            value={formData.qualification}
            maxLength={TEAM_RECRUITMENT_QUALIFICATION_MAX_LENGTH}
            onChange={(e) => setQualification(e.target.value)}
          />
        </div>
      </div>

      <div className={styles['submit-container']}>
        <button
          type="button"
          className={cn({
            [styles['submit-button']]: true,
            [styles['submit-button--disabled']]: !isFormValid,
          })}
          disabled={!isFormValid}
          onClick={handleSubmitClick}
        >
          등록하기
        </button>
      </div>

      {isConfirmModalOpen && <ConfirmModal onCancel={handleCancelConfirm} onConfirm={handleConfirmRegister} />}
    </div>
  );
}
