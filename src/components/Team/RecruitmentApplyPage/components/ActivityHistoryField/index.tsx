import XIcon from 'assets/svg/Team/x-icon.svg';
import useActivityHistoryField from 'components/Team/hooks/useActivityHistoryField';
import {
  APPLY_ACTIVITY_CONTENT_MAX_LENGTH,
  APPLY_ACTIVITY_TITLE_MAX_LENGTH,
} from 'components/Team/RecruitmentApplyPage/schema';
import DatePickerModal from 'components/ui/DatePickerModal';
import styles from './ActivityHistoryField.module.scss';

const LOGGING_TITLE = {
  ADD: 'team_recruitment_apply_activity_add',
  EDIT: 'team_recruitment_apply_activity_modify',
  DONE: 'team_recruitment_apply_activity_modify_complete',
};

export default function ActivityHistoryField() {
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
  } = useActivityHistoryField({
    ADD: LOGGING_TITLE.ADD,
    EDIT: LOGGING_TITLE.EDIT,
    getDoneEvent: (hasBeenSaved) => ({ eventLabel: LOGGING_TITLE.DONE, value: hasBeenSaved ? '수정하기' : '완료' }),
  });

  return (
    <div className={styles.activity}>
      <div className={styles.activity__head}>
        <span className={styles.activity__label}>활동 이력</span>
        <p className={styles.activity__description}>공모전, 대외활동, 자치단체 등 활동 이력을 작성해주세요.</p>
      </div>

      {fields.length > 0 && (
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
                      <button type="button" className={styles.savedCard__edit} onClick={() => handleEdit(index)}>
                        수정
                      </button>
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
                    maxLength={APPLY_ACTIVITY_TITLE_MAX_LENGTH}
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
                    <span className={styles.draftCard__counter}>
                      {activity?.content?.length ?? 0}/{APPLY_ACTIVITY_CONTENT_MAX_LENGTH}
                    </span>
                  </div>
                  {(() => {
                    const { ref: contentRef, ...contentField } = register(`activities.${index}.content` as const);
                    return (
                      <textarea
                        className={styles.draftCard__textarea}
                        placeholder="활동 내용을 간단히 작성해주세요."
                        maxLength={APPLY_ACTIVITY_CONTENT_MAX_LENGTH}
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
      )}

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
