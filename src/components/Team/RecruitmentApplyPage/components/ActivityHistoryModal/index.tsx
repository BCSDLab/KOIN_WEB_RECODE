import { useCallback, useState } from 'react';
import XIcon from 'assets/svg/Team/x-icon.svg';
import {
  APPLY_ACTIVITY_CONTENT_MAX_LENGTH,
  APPLY_ACTIVITY_TITLE_MAX_LENGTH,
} from 'components/Team/RecruitmentApplyPage/schema';
import DatePickerModal from 'components/ui/DatePickerModal';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { getYyyyMmDd } from 'utils/ts/calendar';
import showToast from 'utils/ts/showToast';
import type { ApplyActivityValue } from 'components/Team/RecruitmentApplyPage/types';
import styles from './ActivityHistoryModal.module.scss';

interface ActivityHistoryModalProps {
  /** 수정할 활동 이력. 신규 작성이면 null. */
  initialValue: ApplyActivityValue | null;
  onSubmit: (activity: ApplyActivityValue) => void;
  onClose: () => void;
}

type ActivityDateField = 'startDate' | 'endDate';

let activitySequence = 0;

const createActivityId = () => {
  activitySequence += 1;
  return `activity-${Date.now()}-${activitySequence}`;
};

const createEmptyActivity = (): ApplyActivityValue => ({
  id: createActivityId(),
  title: '',
  startDate: '',
  endDate: null,
  isOngoing: false,
  content: '',
});

export default function ActivityHistoryModal({ initialValue, onSubmit, onClose }: ActivityHistoryModalProps) {
  const { actionEventClick } = useLogger();
  const [draft, setDraft] = useState<ApplyActivityValue>(() => initialValue ?? createEmptyActivity());
  const [openDateField, setOpenDateField] = useState<ActivityDateField | null>(null);

  const handleDismiss = useCallback(() => {
    if (openDateField) return;
    onClose();
  }, [openDateField, onClose]);

  const { containerRef, backgroundRef } = useOutsideClick({ onOutsideClick: handleDismiss });
  useEscapeKeyDown({ onEscape: handleDismiss });

  const handleToggleOngoing = (checked: boolean) => {
    setDraft((prev) => ({ ...prev, isOngoing: checked, endDate: checked ? null : prev.endDate }));
  };

  const handleDateSelect = (field: ActivityDateField) => (date: Date) => {
    setDraft((prev) => ({ ...prev, [field]: getYyyyMmDd(date) }));
  };

  const handleDone = () => {
    if (!draft.title.trim()) {
      showToast('warning', '활동명을 작성해주세요.');
      return;
    }
    if (!draft.startDate) {
      showToast('warning', '활동 시작일을 선택해주세요.');
      return;
    }
    if (!draft.isOngoing && !draft.endDate) {
      showToast('warning', '활동 종료일을 선택하거나 진행 중을 선택해주세요.');
      return;
    }
    if (!draft.isOngoing && draft.endDate && draft.endDate < draft.startDate) {
      showToast('warning', '활동 종료일은 시작일 이후로 선택해주세요.');
      return;
    }
    if (!draft.content.trim()) {
      showToast('warning', '활동 내용을 작성해주세요.');
      return;
    }

    actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: 'team_recruitment_apply_activity_modify_complete',
      value: '수정하기',
    });
    onSubmit(draft);
  };

  const selectedDate = openDateField ? draft[openDateField] : null;

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.sheet} ref={containerRef} role="dialog" aria-modal="true" aria-label="활동 이력 작성">
        <div className={styles.sheet__head}>
          <span className={styles.sheet__title}>활동 이력</span>
          <button type="button" className={styles.sheet__close} onClick={onClose} aria-label="닫기">
            <XIcon aria-hidden />
          </button>
        </div>

        <div className={styles.sheet__body}>
          <div className={styles.field}>
            <label className={styles.field__label} htmlFor="apply-activity-title">
              활동명<span className={styles.field__required}>*</span>
            </label>
            <input
              id="apply-activity-title"
              type="text"
              className={styles.field__control}
              placeholder="활동명을 작성해주세요."
              maxLength={APPLY_ACTIVITY_TITLE_MAX_LENGTH}
              value={draft.title}
              onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
            />
          </div>

          <div className={styles.field}>
            <span className={styles.field__label}>
              활동기간<span className={styles.field__required}>*</span>
            </span>
            <div className={styles.period}>
              <div className={styles.period__inputs}>
                <button
                  type="button"
                  className={styles.period__control}
                  onClick={() => setOpenDateField('startDate')}
                >
                  {draft.startDate ? draft.startDate.replaceAll('-', '.') : '시작일'}
                </button>
                <span className={styles.period__divider}>-</span>
                <button
                  type="button"
                  className={styles.period__control}
                  disabled={draft.isOngoing}
                  onClick={() => setOpenDateField('endDate')}
                >
                  {draft.endDate ? draft.endDate.replaceAll('-', '.') : '종료일'}
                </button>
              </div>
              <label className={styles.ongoing}>
                <input
                  type="checkbox"
                  className={styles.ongoing__input}
                  checked={draft.isOngoing}
                  onChange={(event) => handleToggleOngoing(event.target.checked)}
                />
                <span className={styles.ongoing__icon} aria-hidden />
                진행 중
              </label>
            </div>
          </div>

          <div className={styles.field}>
            <div className={styles.field__row}>
              <label className={styles.field__label} htmlFor="apply-activity-content">
                활동내용<span className={styles.field__required}>*</span>
              </label>
              <span className={styles.field__counter}>
                {draft.content.length}/{APPLY_ACTIVITY_CONTENT_MAX_LENGTH}
              </span>
            </div>
            <textarea
              id="apply-activity-content"
              className={styles.field__textarea}
              placeholder="활동 내용을 간단히 작성해주세요."
              maxLength={APPLY_ACTIVITY_CONTENT_MAX_LENGTH}
              rows={4}
              value={draft.content}
              onChange={(event) => setDraft((prev) => ({ ...prev, content: event.target.value }))}
            />
          </div>
        </div>

        <button type="button" className={styles.sheet__done} onClick={handleDone}>
          {initialValue ? '수정하기' : '완료'}
        </button>
      </div>

      {openDateField && (
        <DatePickerModal
          selectedDate={selectedDate ? new Date(`${selectedDate}T00:00:00`) : new Date()}
          onChange={handleDateSelect(openDateField)}
          onClose={() => setOpenDateField(null)}
        />
      )}
    </div>
  );
}
