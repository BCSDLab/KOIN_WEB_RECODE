import PencilLineIcon from 'assets/svg/Team/pencil-line-icon.svg';
import XIcon from 'assets/svg/Team/x-icon.svg';
import useActivityHistoryField, { type ActivityValue } from 'components/Team/hooks/useActivityHistoryField';
import { savedActivitySchema } from 'components/Team/ProfilePage/schema';
import DatePickerModal from 'components/ui/DatePickerModal';
import type { TeamProfileFormMode } from 'components/Team/ProfilePage/types';
import styles from './ActivityHistoryField.module.scss';

interface ActivityHistoryFieldProps {
  mode: TeamProfileFormMode;
}

const LOGGING_TITLE: Record<TeamProfileFormMode, { ADD: string; EDIT: string; NEW_DONE: string; MODIFY_DONE: string }> =
  {
    create: {
      ADD: 'team_recruitment_profile_create_activity_add',
      EDIT: 'team_recruitment_profile_create_activity_modify',
      NEW_DONE: 'team_recruitment_profile_create_activity_add_complete',
      MODIFY_DONE: 'team_recruitment_profile_create_activity_modify_complete',
    },
    edit: {
      ADD: 'team_recruitment_profile_modify_activity_add',
      EDIT: 'team_recruitment_profile_modify_activity_modify',
      NEW_DONE: 'team_recruitment_profile_modify_activity_complete',
      MODIFY_DONE: 'team_recruitment_profile_modify_activity_modify_complete',
    },
  };

export default function ActivityHistoryField({ mode }: ActivityHistoryFieldProps) {
  const loggingTitle = LOGGING_TITLE[mode];

  // saved로 확정하기 전 검증은 ProfilePage 전체와 같은 스키마(savedActivitySchema)를 재사용한다 —
  // 폼 제출 시 검증과 "완료" 버튼 검증이 서로 다른 기준을 갖지 않도록.
  const validateActivity = (activity: ActivityValue) => {
    const result = savedActivitySchema.safeParse({ ...activity, status: 'saved' });
    return result.success ? { success: true as const } : { success: false as const, message: result.error.issues[0].message };
  };

  const {
    fields,
    activities,
    register,
    openDatePicker,
    handleAppend,
    handleRemove,
    handleEdit,
    handleDone,
    handleToggleOngoing,
    handleDateSelect,
    handleOpenDatePicker,
    handleCloseDatePicker,
  } = useActivityHistoryField(
    {
      ADD: loggingTitle.ADD,
      EDIT: loggingTitle.EDIT,
      getDoneEvent: (hasBeenSaved) =>
        hasBeenSaved
          ? { eventLabel: loggingTitle.MODIFY_DONE, value: '수정하기' }
          : { eventLabel: loggingTitle.NEW_DONE, value: '완료' },
    },
    validateActivity,
  );

  return (
    <div className={styles.activity}>
      <div className={styles.activity__head}>
        <span className={styles.activity__label}>활동 이력</span>
        <p className={styles.activity__description}>공모전, 대외활동, 자치단체 등 활동 이력을 작성해주세요.</p>
      </div>
      <ul className={styles.activity__list}>
        {fields.map((field, index) => {
          const activity = activities[index];
          const isOngoing = activity?.isOngoing ?? false;

          if (activity?.status === 'saved') {
            return (
              <li key={field.id} className={styles.savedCard}>
                <div className={styles.savedCard__head}>
                  <span className={styles.savedCard__title}>{activity.title}</span>
                  <div className={styles.savedCard__actions}>
                    {mode === 'edit' ? (
                      <button
                        type="button"
                        className={styles.savedCard__editIcon}
                        onClick={() => handleEdit(index)}
                        aria-label="활동 이력 수정"
                      >
                        <PencilLineIcon aria-hidden />
                      </button>
                    ) : (
                      <button type="button" className={styles.savedCard__edit} onClick={() => handleEdit(index)}>
                        수정
                      </button>
                    )}
                    <button
                      type="button"
                      className={styles.savedCard__remove}
                      onClick={() => handleRemove(index)}
                      aria-label="활동 이력 삭제"
                    >
                      <XIcon aria-hidden />
                    </button>
                  </div>
                </div>
                <dl className={styles.savedCard__meta}>
                  <dt>활동 기간</dt>
                  <dd>{`${activity.startDate} ~ ${activity.isOngoing ? '진행 중' : (activity.endDate ?? '')}`}</dd>
                  <dt>활동 내용</dt>
                  <dd>{activity.content}</dd>
                </dl>
              </li>
            );
          }

          return (
            <li key={field.id} className={styles.draftCard}>
              <div className={styles.draftCard__group}>
                <div className={styles.draftCard__row}>
                  <span className={styles.draftCard__label}>
                    활동명<span className={styles.draftCard__required}>*</span>
                  </span>
                  <button
                    type="button"
                    className={styles.draftCard__remove}
                    onClick={() => handleRemove(index)}
                    aria-label="활동 이력 삭제"
                  >
                    <XIcon aria-hidden />
                  </button>
                </div>
                <input
                  type="text"
                  className={styles.draftCard__control}
                  placeholder="활동명을 작성해주세요."
                  maxLength={50}
                  {...register(`activities.${index}.title` as const)}
                />
              </div>

              <div className={styles.draftCard__group}>
                <span className={styles.draftCard__label}>
                  활동기간<span className={styles.draftCard__required}>*</span>
                </span>
                <div className={styles.draftCard__period}>
                  <div className={styles.draftCard__periodInputs}>
                    <button
                      type="button"
                      className={styles.draftCard__dateControl}
                      onClick={() => handleOpenDatePicker(index, 'startDate')}
                    >
                      {activity?.startDate ? activity.startDate.replaceAll('-', '.') : '시작일'}
                    </button>
                    <span className={styles.draftCard__periodDivider}>-</span>
                    <button
                      type="button"
                      className={styles.draftCard__dateControl}
                      disabled={isOngoing}
                      onClick={() => handleOpenDatePicker(index, 'endDate')}
                    >
                      {activity?.endDate ? activity.endDate.replaceAll('-', '.') : '종료일'}
                    </button>
                  </div>
                  <label className={styles.draftCard__ongoing}>
                    <input
                      type="checkbox"
                      className={styles.draftCard__checkboxInput}
                      checked={isOngoing}
                      onChange={(event) => handleToggleOngoing(index, event.target.checked)}
                    />
                    <span className={styles.draftCard__radioIcon} aria-hidden />
                    진행 중
                  </label>
                </div>
              </div>

              <div className={styles.draftCard__group}>
                <div className={styles.draftCard__row}>
                  <span className={styles.draftCard__label}>
                    활동내용<span className={styles.draftCard__required}>*</span>
                  </span>
                  <span className={styles.draftCard__counter}>{activity?.content?.length ?? 0}/1000</span>
                </div>
                {(() => {
                  const { ref: contentRef, ...contentField } = register(`activities.${index}.content` as const);
                  return (
                    <textarea
                      className={styles.draftCard__textarea}
                      placeholder="활동 내용을 간단히 작성해주세요."
                      maxLength={1000}
                      rows={4}
                      ref={(el) => {
                        contentRef(el);
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
                      {...contentField}
                    />
                  );
                })()}
              </div>

              <button type="button" className={styles.draftCard__done} onClick={() => handleDone(index)}>
                {activity?.hasBeenSaved ? '수정하기' : '완료'}
              </button>
            </li>
          );
        })}
      </ul>

      <button type="button" className={styles.activity__add} onClick={handleAppend}>
        활동 이력 추가
      </button>

      {openDatePicker &&
        (() => {
          const targetActivity = activities[openDatePicker.index];
          const rawDate = targetActivity?.[openDatePicker.field];
          return (
            <DatePickerModal
              selectedDate={rawDate ? new Date(`${rawDate}T00:00:00`) : new Date()}
              onChange={handleDateSelect(openDatePicker.index, openDatePicker.field)}
              onClose={handleCloseDatePicker}
            />
          );
        })()}
    </div>
  );
}
