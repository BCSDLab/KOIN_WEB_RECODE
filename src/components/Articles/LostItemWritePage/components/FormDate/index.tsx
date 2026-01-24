import { cn } from '@bcsdlab/utils';
import ChevronDown from 'assets/svg/Articles/chevron-down.svg';
import WarnIcon from 'assets/svg/Articles/warn.svg';
import Calendar from 'components/Articles/LostItemWritePage/components/Calendar';
import MobileDatePicker from 'components/Articles/LostItemWritePage/components/MobileDatePicker/MobileDatePicker';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './FormDate.module.scss';

const getyyyyMMdd = (date: Date) => {
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}.${MM}.${dd}`;
};

interface FormDateProps {
  foundDate: Date;
  setFoundDate: (date: Date) => void;
  isDateSelected: boolean;
  hasDateBeenSelected: boolean;
  setHasDateBeenSelected: () => void;
  type: 'FOUND' | 'LOST';
}

export default function FormDate({
  foundDate,
  setFoundDate,
  isDateSelected,
  hasDateBeenSelected,
  setHasDateBeenSelected,
  type,
}: FormDateProps) {
  const [calendarOpen, , closeCalendar, toggleCalendar] = useBooleanState(false);
  const isMobile = useMediaQuery();

  const handleDateSelect = (date: Date) => {
    setFoundDate(date);
    setHasDateBeenSelected();
    closeCalendar();
  };

  const handleMobileDateSelect = (date: Date) => {
    setFoundDate(date);
    setHasDateBeenSelected();
  };

  const { containerRef } = useOutsideClick({ onOutsideClick: closeCalendar });
  useEscapeKeyDown({ onEscape: closeCalendar });

  const dateLabel = type === 'FOUND' ? '습득 일자' : '분실 일자';
  const placeholderText = type === 'FOUND' ? '습득 일자를 선택해주세요.' : '분실 일자를 선택해주세요.';
  const warningText = type === 'FOUND' ? '습득 일자가 입력되지 않았습니다.' : '분실 일자가 입력되지 않았습니다.';

  return (
    <div className={styles.date}>
      <div className={styles.date__text}>
        <div className={styles.date__label}>
          <span className={styles['date__title']}>{dateLabel}</span>
          <span className={styles['date__required']}>*</span>
        </div>
        {!isDateSelected && (
          <span className={styles['date__warning']}>
            <WarnIcon />
            {warningText}
          </span>
        )}
      </div>
      <div className={styles.date__wrapper} ref={containerRef}>
        <div className={styles.date__wrapper}>
          <button className={styles.date__toggle} type="button" onClick={toggleCalendar}>
            <span
              className={cn({
                [styles.date__description]: true,
                [styles['date__description--has-been-selected']]: hasDateBeenSelected,
              })}
            >
              {hasDateBeenSelected ? getyyyyMMdd(foundDate) : placeholderText}
            </span>
            <span
              className={cn({
                [styles.icon]: true,
                [styles['icon--open']]: calendarOpen,
              })}
            >
              <ChevronDown />
            </span>
          </button>
          {calendarOpen && (
            <div className={styles.date__calendar}>
              {isMobile ? (
                <MobileDatePicker selectedDate={foundDate} setSelectedDate={handleMobileDateSelect} />
              ) : (
                <Calendar selectedDate={foundDate} setSelectedDate={handleDateSelect} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
