import { useState } from 'react';
import XIcon from 'assets/svg/Team/x-icon.svg';
import {
  APPLY_ACTIVITY_CONTENT_MAX_LENGTH,
  APPLY_ACTIVITY_TITLE_MAX_LENGTH,
} from 'components/Team/RecruitmentApplyPage/schema';
import DatePickerModal from 'components/ui/DatePickerModal';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import useLogger from 'utils/hooks/analytics/useLogger';
import { getYyyyMmDd } from 'utils/ts/calendar';
import showToast from 'utils/ts/showToast';
import type { ApplicationFormValues } from 'components/Team/RecruitmentApplyPage/types';
import styles from './ActivityHistoryField.module.scss';

const LOGGING_TITLE = {
  ADD: 'team_recruitment_apply_activity_add',
  EDIT: 'team_recruitment_apply_activity_modify',
  DONE: 'team_recruitment_apply_activity_modify_complete',
};

type ActivityDateField = 'startDate' | 'endDate';

interface OpenDatePicker {
  index: number;
  field: ActivityDateField;
}

let activitySequence = 0;

// crypto.randomUUID는 보안 컨텍스트가 아니면 undefined라 개발/스테이징 http 환경에서 터진다.
const createActivityId = () => {
  activitySequence += 1;
  return `activity-${Date.now()}-${activitySequence}`;
};

export default function ActivityHistoryField() {
  const { actionEventClick } = useLogger();
  const { control, register, getValues, setValue } = useFormContext<ApplicationFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'activities' });
  const activities = useWatch({ control, name: 'activities' }) ?? [];
  const [openDatePicker, setOpenDatePicker] = useState<OpenDatePicker | null>(null);

  const handleAppend = () => {
    actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: LOGGING_TITLE.ADD,
      value: '활동 이력 추가',
    });
    append({
      id: createActivityId(),
      title: '',
      startDate: '',
      endDate: null,
      isOngoing: false,
      content: '',
      status: 'draft',
      hasBeenSaved: false,
    });
  };

  const handleRemove = (index: number) => {
    setOpenDatePicker(null);
    remove(index);
  };

  const handleEdit = (index: number) => {
    actionEventClick({ team: 'CAMPUS', event_category: 'click', event_label: LOGGING_TITLE.EDIT, value: '수정' });
    setValue(`activities.${index}.status`, 'draft');
  };

  const handleDone = (index: number) => {
    const activity = getValues(`activities.${index}`);

    if (!activity.title.trim()) {
      showToast('warning', '활동명을 작성해주세요.');
      return;
    }
    if (!activity.startDate) {
      showToast('warning', '활동 시작일을 선택해주세요.');
      return;
    }
    if (!activity.isOngoing && !activity.endDate) {
      showToast('warning', '활동 종료일을 선택하거나 진행 중을 선택해주세요.');
      return;
    }
    if (!activity.isOngoing && activity.endDate && activity.endDate < activity.startDate) {
      showToast('warning', '활동 종료일은 시작일 이후로 선택해주세요.');
      return;
    }
    if (!activity.content.trim()) {
      showToast('warning', '활동 내용을 작성해주세요.');
      return;
    }

    actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: LOGGING_TITLE.DONE,
      value: activity.hasBeenSaved ? '수정하기' : '완료',
    });
    setValue(`activities.${index}.status`, 'saved');
    setValue(`activities.${index}.hasBeenSaved`, true);
  };

  const handleToggleOngoing = (index: number, checked: boolean) => {
    setValue(`activities.${index}.isOngoing`, checked);
    if (checked) {
      setValue(`activities.${index}.endDate`, null);
    }
  };

  const handleDateSelect = (index: number, field: ActivityDateField) => (date: Date) => {
    setValue(`activities.${index}.${field}`, getYyyyMmDd(date));
  };

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
                        onClick={() => setOpenDatePicker({ index, field: 'startDate' })}
                      >
                        {activity?.startDate ? activity.startDate.replaceAll('-', '.') : '시작일'}
                      </button>
                      <span className={styles.draftCard__periodDivider}>-</span>
                      <button
                        type="button"
                        className={styles.draftCard__dateControl}
                        disabled={isOngoing}
                        onClick={() => setOpenDatePicker({ index, field: 'endDate' })}
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
              onClose={() => setOpenDatePicker(null)}
            />
          );
        })()}
    </div>
  );
}
