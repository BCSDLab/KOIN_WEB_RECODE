import { ComponentType, useState } from 'react';
import { cn } from '@bcsdlab/utils';
import ComputerIcon from 'assets/svg/Team/computer.svg';
import KeyframesDoubleIcon from 'assets/svg/Team/keyframes-double.svg';
import UserGroupIcon from 'assets/svg/Team/user-group-02.svg';
import SubPageHeader from 'components/ui/SubPageHeader';
import { Controller, useWatch } from 'react-hook-form';
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
import type { TeamRecruitmentFormValues } from './schema';
import styles from './NewTeamRecruitment.module.scss';

const PROGRESS_TYPE_ICON: Record<TeamRecruitmentProgressType, ComponentType> = {
  ONLINE: ComputerIcon,
  OFFLINE: UserGroupIcon,
  HYBRID: KeyframesDoubleIcon,
};

interface NewTeamRecruitmentProps {
  initialValues?: TeamRecruitmentFormValues;
  mode?: 'create' | 'edit';
  onSubmit?: (values: TeamRecruitmentFormValues) => Promise<void>;
}

export default function NewTeamRecruitment({ initialValues, mode = 'create', onSubmit }: NewTeamRecruitmentProps) {
  const logger = useLogger();
  const form = useTeamRecruitmentForm(initialValues);
  const { control, register, formState, handleSubmit } = form;
  const isEditMode = mode === 'edit';
  const headerTitle = isEditMode ? '모집글 수정' : '모집글 작성';
  const submitLabel = isEditMode ? '수정 완료' : '등록하기';
  const confirmLabel = isEditMode ? '수정하기' : '등록하기';

  const title = useWatch({ control, name: 'title' });
  const description = useWatch({ control, name: 'description' });
  const qualification = useWatch({ control, name: 'qualification' });

  const [isConfirmModalOpen, openConfirmModal, closeConfirmModal] = useBooleanState(false);
  const [pendingValues, setPendingValues] = useState<TeamRecruitmentFormValues | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitClick = handleSubmit((values) => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: isEditMode ? 'team_recruitment_post_edit_submit' : 'team_recruitment_recruit_submit',
      value: submitLabel,
    });
    setPendingValues(values);
    openConfirmModal();
  });

  const handleCancelConfirm = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: isEditMode ? 'team_recruitment_post_edit_submit_cancel' : 'team_recruitment_recruit_submit_cancel',
      value: '취소하기',
    });
    closeConfirmModal();
  };

  const handleConfirmSubmit = async () => {
    if (!pendingValues || isSubmitting) return;

    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: isEditMode ? 'team_recruitment_post_edit_submit_confirm' : 'team_recruitment_recruit_submit_confirm',
      value: confirmLabel,
    });

    if (!onSubmit) {
      // TODO: 모집글 작성 담당 PR에서 작성 API를 연결한다.
      closeConfirmModal();
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(pendingValues);
      closeConfirmModal();
    } catch {
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <SubPageHeader title={headerTitle} />

      <div className={styles.form}>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <CategoryField
              eventLabel={isEditMode ? 'team_recruitment_post_edit_category' : 'team_recruitment_recruit_category'}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <div className={styles.form__item}>
          <div className={styles['form__item-header']}>
            <label className={styles.form__label} htmlFor="team-recruitment-title">
              제목 <span className={styles['form__label-required']}>*</span>
            </label>
            <span className={styles.form__counter}>
              {title.length}/{TEAM_RECRUITMENT_TITLE_MAX_LENGTH}
            </span>
          </div>
          <input
            id="team-recruitment-title"
            type="text"
            className={styles.form__input}
            placeholder="제목을 입력해주세요."
            maxLength={TEAM_RECRUITMENT_TITLE_MAX_LENGTH}
            {...register('title')}
          />
        </div>

        <div className={styles.form__item}>
          <div className={styles.form__label}>
            진행방식 <span className={styles['form__label-required']}>*</span>
          </div>
          <Controller
            control={control}
            name="progressType"
            render={({ field }) => (
              <div className={styles['progress-type']}>
                {(Object.keys(TEAM_RECRUITMENT_PROGRESS_TYPE_LABEL) as TeamRecruitmentProgressType[]).map((type) => {
                  const Icon = PROGRESS_TYPE_ICON[type];
                  const isSelected = field.value === type;
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
                          event_label: isEditMode
                            ? 'team_recruitment_post_edit_method'
                            : 'team_recruitment_recruit_method',
                          value: TEAM_RECRUITMENT_PROGRESS_TYPE_LABEL[type].replaceAll(' ', ''),
                        });
                        field.onChange(type);
                      }}
                    >
                      <Icon />
                      {TEAM_RECRUITMENT_PROGRESS_TYPE_LABEL[type]}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>

        <ScheduleField control={control} />

        <RoleField
          control={control}
          eventLabel={isEditMode ? 'team_recruitment_post_edit_role' : 'team_recruitment_recruit_role'}
        />

        <div className={styles.form__item}>
          <div className={styles['form__item-header']}>
            <label className={styles.form__label} htmlFor="team-recruitment-description">
              모집 소개 <span className={styles['form__label-required']}>*</span>
            </label>
            <span className={styles.form__counter}>
              {description.length}/{TEAM_RECRUITMENT_DESCRIPTION_MAX_LENGTH}
            </span>
          </div>
          <textarea
            id="team-recruitment-description"
            className={styles.form__textarea}
            placeholder="소개를 작성해주세요."
            maxLength={TEAM_RECRUITMENT_DESCRIPTION_MAX_LENGTH}
            {...register('description')}
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
            {...register('relatedUrl')}
          />
        </div>

        <div className={styles.form__item}>
          <div className={styles['form__item-header']}>
            <label className={styles.form__label} htmlFor="team-recruitment-qualification">
              지원 자격
            </label>
            <span className={styles.form__counter}>
              {qualification.length}/{TEAM_RECRUITMENT_QUALIFICATION_MAX_LENGTH}
            </span>
          </div>
          <textarea
            id="team-recruitment-qualification"
            className={styles.form__textarea}
            placeholder="지원 자격 또는 우대사항을 작성해주세요."
            maxLength={TEAM_RECRUITMENT_QUALIFICATION_MAX_LENGTH}
            {...register('qualification')}
          />
        </div>
      </div>

      <div className={styles['submit-container']}>
        <button
          type="button"
          className={cn({
            [styles['submit-button']]: true,
            [styles['submit-button--disabled']]: !formState.isValid || isSubmitting,
          })}
          disabled={!formState.isValid || isSubmitting}
          onClick={handleSubmitClick}
        >
          {submitLabel}
        </button>
      </div>

      {isConfirmModalOpen && (
        <ConfirmModal
          confirmLabel={confirmLabel}
          description={`해당 모집글을 ${isEditMode ? '수정' : '등록'}하시겠습니까?`}
          isPending={isSubmitting}
          onCancel={handleCancelConfirm}
          onClose={closeConfirmModal}
          onConfirm={handleConfirmSubmit}
        />
      )}
    </div>
  );
}
