import { TeamRecruitmentFormValues } from 'components/Team/NewTeamRecruitment/schema';
import DatePickerModal from 'components/ui/DatePickerModal';
import { Control, Controller } from 'react-hook-form';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { getYyyyMmDd } from 'utils/ts/calendar';
import styles from './ScheduleField.module.scss';

interface ScheduleFieldProps {
  control: Control<TeamRecruitmentFormValues>;
}

function formatDotDate(date: Date | null) {
  return date ? getYyyyMmDd(date, '.') : '';
}

export default function ScheduleField({ control }: ScheduleFieldProps) {
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
            <Controller
              control={control}
              name="activityStartDate"
              render={({ field }) => (
                <>
                  <button type="button" className={styles.schedule__date} onClick={openStartCalendar}>
                    {formatDotDate(field.value)}
                  </button>
                  {isStartCalendarOpen && (
                    <DatePickerModal
                      selectedDate={field.value ?? new Date()}
                      onChange={field.onChange}
                      onClose={closeStartCalendar}
                    />
                  )}
                </>
              )}
            />
            <span className={styles.schedule__separator}>-</span>
            <Controller
              control={control}
              name="activityEndDate"
              render={({ field }) => (
                <>
                  <button type="button" className={styles.schedule__date} onClick={openEndCalendar}>
                    {formatDotDate(field.value)}
                  </button>
                  {isEndCalendarOpen && (
                    <DatePickerModal
                      selectedDate={field.value ?? new Date()}
                      onChange={field.onChange}
                      onClose={closeEndCalendar}
                    />
                  )}
                </>
              )}
            />
          </div>
        </div>
        <div className={styles.schedule__item}>
          <span className={styles.schedule__label}>마감일</span>
          <Controller
            control={control}
            name="deadlineDate"
            render={({ field }) => (
              <>
                <button type="button" className={styles.schedule__date} onClick={openDeadlineCalendar}>
                  {formatDotDate(field.value)}
                </button>
                {isDeadlineCalendarOpen && (
                  <DatePickerModal
                    selectedDate={field.value ?? new Date()}
                    onChange={field.onChange}
                    onClose={closeDeadlineCalendar}
                  />
                )}
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
}
