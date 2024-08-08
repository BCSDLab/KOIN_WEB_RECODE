/* eslint-disable no-restricted-imports */
import React from 'react';
import { cn } from '@bcsdlab/utils';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { DeptListResponse } from 'api/dept/entity';
import { ReactComponent as DownArrowIcon } from 'assets/svg/down-arrow-icon.svg';
import { ReactComponent as UpArrowIcon } from 'assets/svg/up-arrow-icon.svg';
import { ReactComponent as CurriculumIcon } from 'assets/svg/curriculum-icon.svg';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import styles from 'pages/Timetable/TimetablePage/DefaultPage/DefaultPage.module.scss';

export interface CurriculumListBoxProps {
  list: DeptListResponse;
}

function CurriculumListBox({ list }: CurriculumListBoxProps) {
  const [isOpenedPopup, , closePopup, triggerPopup] = useBooleanState(false);
  const { containerRef } = useOutsideClick({ onOutsideClick: closePopup });
  useEscapeKeyDown({ onEscape: closePopup });

  const handleToggleListBox = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    triggerPopup();
  };

  const onClickOption = () => {
    closePopup();
  };

  return (
    <div
      className={cn({
        [styles.select]: true,
        [styles['select--opened']]: isOpenedPopup,
      })}
      ref={containerRef}
    >
      <button
        type="button"
        onClick={handleToggleListBox}
        className={cn({
          [styles.select__trigger]: true,
          [styles['select__trigger--opened']]: isOpenedPopup,
        })}
      >
        <div className={styles['select__curriculum-title']}>
          <CurriculumIcon />
          커리큘럼
        </div>
        {isOpenedPopup ? <UpArrowIcon /> : <DownArrowIcon />}
      </button>
      {isOpenedPopup && (
      <div className={styles['select__curriculum-list']} role="listbox">
        {list.map((dept) => (
          <a
            href={dept.curriculum_link}
            target="_blank"
            rel="noreferrer"
            onClick={onClickOption}
          >
            <span
              className={styles.select__curriculum}
              key={dept.name}
              role="option"
              aria-selected="false"
              data-value={dept.name}
              tabIndex={0}
            >
              {dept.name}
            </span>
          </a>
        ))}
        <a
          href="https://www.koreatech.ac.kr/board.es?mid=a10103010000&bid=0002"
          target="_blank"
          rel="noreferrer"
          onClick={onClickOption}
          className={styles.select__curriculum}
        >
          대학 요람
        </a>
      </div>
      )}
    </div>
  );
}

export default CurriculumListBox;
