import { useState } from 'react';
import XIcon from 'assets/svg/Team/x-icon.svg';
import DatePickerModal from 'components/Club/NewClubRecruitment/components/DatePickerModal';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import useLogger from 'utils/hooks/analytics/useLogger';
import { getYyyyMmDd } from 'utils/ts/calendar';
import showToast from 'utils/ts/showToast';
import type { ProfileFormValues } from 'components/Team/ProfilePage/types';
import styles from './ActivityHistoryField.module.scss';

const loggingTitle = {
  ADD: 'team_profile_activity_add',
  DONE: 'team_profile_activity_done',
  EDIT: 'team_profile_activity_edit',
  REMOVE: 'team_profile_activity_remove',
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
  const { control, register, getValues, setValue } = useFormContext<ProfileFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'activities' });
  const activities = useWatch({ control, name: 'activities' }) ?? [];
  const [openDatePicker, setOpenDatePicker] = useState<OpenDatePicker | null>(null);

  const handleAppend = () => {
    // TODO: 팀원모집 도메인 로깅 team 값 컨벤션 확인 필요
    actionEventClick({ team: 'TEAM', event_category: 'click', event_label: loggingTitle.ADD, value: '활동 이력 추가' });
    append({
      id: createActivityId(),
      title: '',
      startDate: '',
      endDate: null,
      isOngoing: false,
      content: '',
      status: 'draft',
    });
  };

  const handleRemove = (index: number) => {
    // TODO: 팀원모집 도메인 로깅 team 값 컨벤션 확인 필요
    actionEventClick({ team: 'TEAM', event_category: 'click', event_label: loggingTitle.REMOVE, value: '삭제' });
    // 삭제로 인덱스가 밀리면 열려 있던 날짜 선택 모달이 엉뚱한 항목을 가리킬 수 있어 항상 닫는다.
    setOpenDatePicker(null);
    remove(index);
  };

  const handleEdit = (index: number) => {
    // TODO: 팀원모집 도메인 로깅 team 값 컨벤션 확인 필요
    actionEventClick({ team: 'TEAM', event_category: 'click', event_label: loggingTitle.EDIT, value: '수정' });
    setValue(`activities.${index}.status`, 'draft');
  };

  const handleDone = (index: number) => {
    const activity = getValues(`activities.${index}`);

    if (!activity.title.trim()) {
      showToast('warning', '활동명을 작성해주세요.');
      return;
    }
    if (!activity.content.trim()) {
      showToast('warning', '활동 내용을 작성해주세요.');
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

    // TODO: 팀원모집 도메인 로깅 team 값 컨벤션 확인 필요
    actionEventClick({ team: 'TEAM', event_category: 'click', event_label: loggingTitle.DONE, value: '완료' });
    setValue(`activities.${index}.status`, 'saved');
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
      <span className={styles.activity__label}>활동 이력</span>
      <p className={styles.activity__description}>공모전, 대외활동, 자치단체 등 활동 이력을 작성해주세요.</p>

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
                  <span className={styles.draftCard__counter}>{activity?.content?.length ?? 0}/1000</span>
                </div>
                <textarea
                  className={styles.draftCard__textarea}
                  placeholder="활동 내용을 간단히 작성해주세요."
                  maxLength={1000}
                  rows={4}
                  {...register(`activities.${index}.content` as const)}
                />
              </div>

              <button type="button" className={styles.draftCard__done} onClick={() => handleDone(index)}>
                완료
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
              selectedDate={rawDate ? new Date(rawDate) : new Date()}
              onChange={handleDateSelect(openDatePicker.index, openDatePicker.field)}
              onClose={() => setOpenDatePicker(null)}
            />
          );
        })()}
    </div>
  );
}
