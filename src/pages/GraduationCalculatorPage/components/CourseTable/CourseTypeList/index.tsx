import { cn } from '@bcsdlab/utils';
import { useState } from 'react';
import DownArrowIcon from 'assets/svg/chervron-up-grey.svg';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './CourseTypeList.module.scss';

export interface CourseTypeListProps {
  courseTypeDefault?: string;
  id: number;
  onCourseTypeChange: (id: number, newCourseType: string) => void;
}

function CourseTypeList({
  courseTypeDefault = '이수구분선택',
  id,
  onCourseTypeChange,
}: CourseTypeListProps) {
  const [isOpenedPopup, , closePopup, triggerPopup] = useBooleanState(false);
  const { containerRef } = useOutsideClick({ onOutsideClick: closePopup });
  const [selectedValue, setSelectedValue] = useState<string>(courseTypeDefault);
  const [isOverHalf, setIsOverHalf] = useState<boolean>(false);

  const courseType = [
    { id: 1, value: '교양필수' },
    { id: 2, value: '교양선택' },
    { id: 3, value: '전공필수' },
    { id: 4, value: '전공선택' },
    { id: 5, value: 'MSC필수' },
    { id: 6, value: 'MSC선택' },
    { id: 7, value: 'HRD필수' },
    { id: 8, value: 'HRD선택' },
    { id: 9, value: '자유선택' },
    { id: 10, value: '다전공' },
  ];

  const handleToggleList = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    triggerPopup();

    if (containerRef.current) {
      const dropdownRect = containerRef.current.getBoundingClientRect();
      const tableBody = containerRef.current.closest('tbody');

      if (tableBody) {
        const tableBodyRect = tableBody.getBoundingClientRect();
        const tableCenter = tableBodyRect.top + tableBodyRect.height / 2;

        setIsOverHalf(dropdownRect.bottom > tableCenter);
      }
    }
  };

  const onClickOption = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const { currentTarget } = e;
    const newCourseType = currentTarget.getAttribute('data-value') ?? '';

    if (newCourseType !== selectedValue) {
      setSelectedValue(newCourseType);
      onCourseTypeChange(id, newCourseType);
    }

    closePopup();
  };

  return (
    <div
      className={styles.select}
      ref={containerRef}
    >
      <button
        type="button"
        onClick={handleToggleList}
        className={cn({
          [styles.select__trigger]: true,
          [styles['select__trigger--selected']]: isOpenedPopup,
        })}
      >
        <p className={styles.select__label}>{selectedValue}</p>
        <DownArrowIcon />
      </button>
      {isOpenedPopup && (
        <ul
          className={
            cn({
              [styles.select__content]: true,
              [styles['select__content-up']]: isOverHalf,
            })
          }
          role="listbox"
        >
          {courseType.map((type) => (
            <button
              type="button"
              className={styles.select__option}
              key={type.value}
              role="option"
              aria-selected={type.value === selectedValue}
              data-value={type.value}
              onClick={onClickOption}
              tabIndex={0}
            >
              {type.value}
            </button>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CourseTypeList;
