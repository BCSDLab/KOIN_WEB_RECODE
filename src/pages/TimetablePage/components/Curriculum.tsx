/* eslint-disable no-restricted-imports */
import React from 'react';
import { cn } from '@bcsdlab/utils';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { DeptListResponse } from 'api/dept/entity';
import { ReactComponent as DownArrowIcon } from 'assets/svg/down-arrow-icon.svg';
import { ReactComponent as CurriculumIcon } from 'assets/svg/curriculum-icon.svg';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from 'pages/TimetablePage/MainTimetablePage/DefaultPage/DefaultPage.module.scss';

export interface CurriculumListBoxProps {
  list: DeptListResponse;
}

function CurriculumListBox({ list }: CurriculumListBoxProps) {
  const [isOpenedPopup, , closePopup, triggerPopup] = useBooleanState(false);

  const handleToggleListBox = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    triggerPopup();
  };

  const onClickOption = () => {
    closePopup();
  };

  const { backgroundRef } = useOutsideClick({ onOutsideClick: closePopup });

  return (
    <div
      className={cn({
        [styles.select]: true,
        [styles['select--opened']]: isOpenedPopup,
      })}
      ref={backgroundRef}
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
        <DownArrowIcon />
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
