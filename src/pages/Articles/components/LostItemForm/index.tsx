import { cn } from '@bcsdlab/utils';
import ChevronDown from 'assets/svg/Articles/chevron-down.svg';
import GarbageCanIcon from 'assets/svg/Articles/garbage-can.svg';
import WarnIcon from 'assets/svg/Articles/warn.svg';
import Calendar from 'pages/Articles/components/Calendar';
import { LostItem, LostItemHandler } from 'pages/Articles/hooks/useLostItemForm';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import FormImage from 'pages/Articles/components/FormImage';
import FormContent from 'pages/Articles/components/FormContent';
import FormFoundPlace from 'pages/Articles/components/FormFoundPlace';
import FormCategory from 'pages/Articles/components/FormCategory';
import styles from './LostItemForm.module.scss';

const MAX_LOST_ITEM_TYPE = {
  found: '습득물',
  lost: '분실물',
};

const getyyyyMMdd = (date: Date) => {
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}.${MM}.${dd}`;
};

interface LostItemFormProps {
  type: 'found' | 'lost';
  count: number;
  lostItem: LostItem;
  lostItemHandler: LostItemHandler;
  removeLostItem: (index: number) => void;
}

export default function LostItemForm({
  type, count, lostItem, lostItemHandler, removeLostItem,
}: LostItemFormProps) {
  const {
    category,
    foundDate,
    foundPlace,
    content,
    images,
    hasDateBeenSelected,
    isCategorySelected,
    isDateSelected,
    isFoundPlaceSelected: isLocationSelected,
  } = lostItem;
  const {
    setCategory,
    setFoundDate,
    setFoundPlace,
    setContent,
    setImages,
    setHasDateBeenSelected,
  } = lostItemHandler;

  const [calendarOpen,, closeCalendar, toggleCalendar] = useBooleanState(false);

  const handleDateSelect = (date: Date) => {
    setFoundDate(date);
    setHasDateBeenSelected();
    closeCalendar();
  };

  const { containerRef } = useOutsideClick({ onOutsideClick: closeCalendar });
  useEscapeKeyDown({ onEscape: closeCalendar });

  return (
    <div className={styles.container}>
      <div className={styles.tag}>
        <span className={styles.tag__chip}>
          {MAX_LOST_ITEM_TYPE[type]}
          &nbsp;
          {count + 1}
        </span>
        <button
          className={styles.tag__delete}
          type="button"
          onClick={() => removeLostItem(count)}
          aria-label="분실물 삭제"
        >
          <GarbageCanIcon />
        </button>
      </div>
      <div className={styles.template}>
        <div className={`${styles.template__left} ${styles.left}`}>
          <FormCategory
            category={category}
            setCategory={setCategory}
            isCategorySelected={isCategorySelected}
          />
          <div className={styles.date}>
            <span className={styles.title}>습득 일자</span>
            <div className={styles.date__wrapper} ref={containerRef}>
              <div className={styles.date__wrapper}>
                <button
                  className={styles.date__toggle}
                  type="button"
                  onClick={toggleCalendar}
                >
                  <span
                    className={cn({
                      [styles.date__description]: true,
                      [styles['date__description--has-been-selected']]: hasDateBeenSelected,
                    })}
                  >
                    {hasDateBeenSelected ? getyyyyMMdd(foundDate) : '습득 일자를 선택해주세요.'}
                  </span>
                  <span className={cn({
                    [styles.icon]: true,
                    [styles['icon--open']]: calendarOpen,
                  })}
                  >
                    <ChevronDown />
                  </span>
                </button>
                {calendarOpen && (
                  <div className={styles.date__calendar}>
                    <Calendar
                      selectedDate={foundDate}
                      setSelectedDate={handleDateSelect}
                    />
                  </div>
                )}
                {!isDateSelected && (
                  <span className={styles.warning}>
                    <WarnIcon />
                    습득 일자가 입력되지 않았습니다.
                  </span>
                )}
              </div>
            </div>
          </div>
          <FormFoundPlace
            foundPlace={foundPlace}
            setFoundPlace={setFoundPlace}
            isLocationSelected={isLocationSelected}
          />
        </div>
        <div className={`${styles.template__right}`}>
          <FormImage images={images} setImages={setImages} />
        </div>
        <div className={styles.template__bottom}>
          <FormContent content={content} setContent={setContent} />
        </div>
      </div>
    </div>
  );
}
