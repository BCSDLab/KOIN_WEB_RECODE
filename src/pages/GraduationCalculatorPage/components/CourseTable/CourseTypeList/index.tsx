import { cn } from '@bcsdlab/utils';
import { useState } from 'react';
import DownArrowIcon from 'assets/svg/chervron-up-grey.svg';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './CourseTypeList.module.scss';

export interface CourseTypeListProps {
  courseTypeDefault: string;
  id: number;
  onCourseTypeChange: (id: number, newCourseType: string) => void;
}

function CourseTypeList({
  courseTypeDefault,
  id,
  onCourseTypeChange,
}: CourseTypeListProps) {
  const [isOpenedPopup, , closePopup, triggerPopup] = useBooleanState(false);
  const { containerRef } = useOutsideClick({ onOutsideClick: closePopup });

  const [selectedValue, setSelectedValue] = useState<string>(courseTypeDefault);

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
  };

  const onClickOption = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const { currentTarget } = e;
    const newCourseType = currentTarget.getAttribute('data-value') ?? '';
    setSelectedValue(newCourseType);

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
          className={styles.select__content}
          role="listbox"
        >
          {courseType.map((type) => (
            <button
              type="button"
              className={cn({
                [styles.select__option]: true,
                // [styles['select__option--selected']]: type.value === value,
              })}
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
