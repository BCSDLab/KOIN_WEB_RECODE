/* eslint-disable no-restricted-imports */
import React from 'react';
import { cn } from '@bcsdlab/utils';
import useBooleanState from 'utils/hooks/useBooleanState';
import { DeptListResponse } from 'api/dept/entity';
import { ReactComponent as LowerArrow } from 'assets/svg/lower-angle-bracket.svg';
import { ReactComponent as UpperArrow } from 'assets/svg/upper-angle-bracket.svg';
import styles from 'pages/Timetable/TimetablePage/DefaultPage/DefaultPage.module.scss';

export interface DeptListboxProps {
  list: DeptListResponse;
  value: string | null;
  onChange: (event: { target: string }) => void;
}

function CurriculumListBox({
  list,
  value,
  onChange,
}: DeptListboxProps) {
  const [isOpenedPopup, , closePopup, triggerPopup] = useBooleanState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const onClickOption = (event: React.MouseEvent<HTMLElement>) => {
    const { currentTarget } = event;
    const optionValue = currentTarget.getAttribute('data-value');
    onChange({ target: optionValue ?? '' });
    closePopup();
  };

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const { target } = event;
      if (wrapperRef.current && target && !wrapperRef.current.contains(target as HTMLElement)) {
        closePopup();
      }
    }
    document.body.addEventListener('click', handleClickOutside);
    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  });

  return (
    <div
      className={styles.select}
      ref={wrapperRef}
    >
      <button
        type="button"
        onClick={triggerPopup}
        className={cn({
          [styles.select__trigger]: true,
          [styles['select__trigger--opened']]: isOpenedPopup,
        })}
      >
        {value !== null ? list.find((item) => item.name === value)?.name : '커리큘럼'}
        {isOpenedPopup ? <UpperArrow width={24} height={24} viewBox="-6 -8 24 24" /> : <LowerArrow width={24} height={24} viewBox="-6 -8 24 24" />}
      </button>
      {isOpenedPopup && (
        <ul className={styles['select__curriculum-list']} role="listbox">
          {list.map((dept) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <li
              className={styles.select__curriculum}
              key={dept.name}
              role="option"
              aria-selected={dept.name === value}
              data-value={dept.name}
              onClick={onClickOption}
              tabIndex={0}
            >
              <a
                href={dept.curriculum_link}
                target="_blank"
                rel="noreferrer"
              >
                {dept.name}
              </a>
            </li>
          ))}
          <li className={styles.select__curriculum}>
            <a
              href="https://www.koreatech.ac.kr/board.es?mid=a10103010000&bid=0002"
              target="_blank"
              rel="noreferrer"
            >
              대학 요람
            </a>
          </li>
        </ul>
      )}
    </div>
  );
}

export default CurriculumListBox;
