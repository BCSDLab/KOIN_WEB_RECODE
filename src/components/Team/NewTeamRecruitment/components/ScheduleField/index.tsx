import { cn } from '@bcsdlab/utils';
import DatePickerModal from 'components/ui/DatePickerModal';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import styles from './ScheduleField.module.scss';

interface ScheduleFieldProps {
  activityStartDate: Date | null;
  activityEndDate: Date | null;
  deadlineDate: Date | null;
  onActivityStartDateChange: (date: Date) => void;
  onActivityEndDateChange: (date: Date) => void;
  onDeadlineDateChange: (date: Date) => void;
}

function formatDotDate(date: Date | null) {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

export default function ScheduleField({
  activityStartDate,
  activityEndDate,
  deadlineDate,
  onActivityStartDateChange,
  onActivityEndDateChange,
  onDeadlineDateChange,
}: ScheduleFieldProps) {
  const [isStartCalendarOpen, openStartCalendar, closeStartCalendar] = useBooleanState(false);
  const [isEndCalendarOpen, openEndCalendar, closeEndCalendar] = useBooleanState(false);
  const [isDeadlineCalendarOpen, openDeadlineCalendar, closeDeadlineCalendar] = useBooleanState(false);

  return (
    <div className={styles.field}>
      <div className={styles.field__label}>
        일정 <span className={styles['field__label-required']}>*</span>
      </div>
      <div className={styles.schedule}>
        <div className={styles.schedule__item}>
          <span className={styles.schedule__label}>활동기간</span>
          <div className={styles.schedule__range}>
            <button type="button" className={styles.schedule__date} onClick={openStartCalendar}>
              {formatDotDate(activityStartDate)}
            </button>
            <span className={styles.schedule__separator}>-</span>
            <button type="button" className={styles.schedule__date} onClick={openEndCalendar}>
              {formatDotDate(activityEndDate)}
            </button>
          </div>
        </div>
        <div className={styles.schedule__item}>
          <span className={styles.schedule__label}>마감일</span>
          <button
            type="button"
            className={cn({ [styles.schedule__date]: true, [styles['schedule__date--single']]: true })}
            onClick={openDeadlineCalendar}
          >
            {formatDotDate(deadlineDate)}
          </button>
        </div>
      </div>

      {isStartCalendarOpen && (
        <DatePickerModal
          selectedDate={activityStartDate ?? new Date()}
          onChange={onActivityStartDateChange}
          onClose={closeStartCalendar}
        />
      )}
      {isEndCalendarOpen && (
        <DatePickerModal
          selectedDate={activityEndDate ?? new Date()}
          onChange={onActivityEndDateChange}
          onClose={closeEndCalendar}
        />
      )}
      {isDeadlineCalendarOpen && (
        <DatePickerModal
          selectedDate={deadlineDate ?? new Date()}
          onChange={onDeadlineDateChange}
          onClose={closeDeadlineCalendar}
        />
      )}
    </div>
  );
}
