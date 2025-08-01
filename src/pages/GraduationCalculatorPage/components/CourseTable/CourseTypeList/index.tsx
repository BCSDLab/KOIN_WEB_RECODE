import { cn } from '@bcsdlab/utils';
import { useRef, useState } from 'react';
import useLogger from 'utils/hooks/analytics/useLogger';
import DownArrowIcon from 'assets/svg/chervron-up-grey.svg';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import useTokenState from 'utils/hooks/state/useTokenState';
import useGeneralEducation from 'pages/GraduationCalculatorPage/hooks/useGeneralEducation';
import { useScrollLock } from 'utils/hooks/ui/useScrollLock';
import styles from './CourseTypeList.module.scss';

export interface CourseTypeListProps {
  courseTypeDefault?: string;
  selectedGeneralEducationArea?: string;
  id: number;
  onCourseTypeChange: (id: number, newCourseType: string, newGeneralEducationArea?: string) => void;
}

function CourseTypeList({
  courseTypeDefault = '이수구분선택',
  selectedGeneralEducationArea = '',
  id,
  onCourseTypeChange,
}: CourseTypeListProps) {
  const logger = useLogger();
  const { lock, unlock } = useScrollLock(false);
  const [isOpenedPopup, , closePopup, triggerPopup] = useBooleanState(false);
  const [isOverHalf, setIsOverHalf] = useState<boolean>(false);

  const token = useTokenState();
  const { generalEducation } = useGeneralEducation(token);
  // '교양선택'은 교양 세부 영역 리스트에서 제외
  const generalCourseType = generalEducation
    ?.general_education_area.map((area) => area.course_type)?.slice(1) || [];
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ left: 0, top: 0 });
  const selectedRef = useRef<HTMLButtonElement | null>(null);

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

  const handleClosePopup = () => {
    closePopup();
    unlock();
  };

  const { containerRef } = useOutsideClick({ onOutsideClick: handleClosePopup });

  const handleToggleList = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isOpenedPopup) {
      handleClosePopup();
    } else {
      logger.actionEventClick({
        team: 'USER',
        event_label: 'graduation_calculator_completion_category',
        value: `이수 구분_${courseTypeDefault}`,
      });
      triggerPopup();
      lock();
    }

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

    if (newCourseType !== courseTypeDefault) {
      onCourseTypeChange(id, newCourseType);
    }

    handleClosePopup();
  };

  const onClickGeneralOption = (
    e: React.MouseEvent<HTMLButtonElement>,
    generalEducationArea: string,
  ) => {
    e.stopPropagation();

    if (selectedGeneralEducationArea !== generalEducationArea) {
      onCourseTypeChange(id, '교양선택', generalEducationArea);
    } else {
      onCourseTypeChange(id, '교양선택');
    }

    handleClosePopup();
  };

  const onHoverCourseSelect = () => {
    setHoveredItem('교양선택');

    if (selectedRef.current) {
      const rect = selectedRef.current.getBoundingClientRect();
      setDropdownPosition({
        left: rect.right,
        top: rect.top,
      });
    }
  };

  return (
    <div className={styles.select} ref={containerRef}>
      <button
        type="button"
        onClick={handleToggleList}
        className={cn({
          [styles.select__trigger]: true,
          [styles['select__trigger--selected']]: isOpenedPopup,
          [styles['select__trigger--selected-up']]: isOverHalf,
        })}
      >
        <p className={styles.select__label}>{courseTypeDefault}</p>
        <DownArrowIcon />
      </button>

      {isOpenedPopup && (
        <ul
          className={cn({
            [styles.select__content]: true,
            [styles['select__content-up']]: isOverHalf,
          })}
          role="listbox"
        >
          {courseType.map((type) => (
            <div
              key={type.value}
              onMouseEnter={type.value === '교양선택' ? onHoverCourseSelect : () => setHoveredItem(null)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <button
                ref={type.value === '교양선택' ? selectedRef : null}
                type="button"
                className={cn({
                  [styles.select__option]: true,
                  [styles['select__option--selected']]: type.value === courseTypeDefault,
                })}
                role="option"
                aria-selected={type.value === courseTypeDefault}
                data-value={type.value}
                onClick={onClickOption}
              >
                {type.value}
              </button>
            </div>
          ))}
          {hoveredItem === '교양선택'
          && (
          <ul
            className={styles['select__general-list']}
            onMouseEnter={() => setHoveredItem('교양선택')}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              left: dropdownPosition.left,
              top: dropdownPosition.top,
            }}
          >
            {generalCourseType.map((type) => (
              <button
                type="button"
                className={cn({
                  [styles['select__general-item']]: true,
                  [styles['select__general-item--selected']]: type === selectedGeneralEducationArea,
                })}
                onClick={(e) => onClickGeneralOption(e, type)}
              >
                {type}
              </button>
            ))}
          </ul>
          )}
        </ul>
      )}
    </div>
  );
}

export default CourseTypeList;
