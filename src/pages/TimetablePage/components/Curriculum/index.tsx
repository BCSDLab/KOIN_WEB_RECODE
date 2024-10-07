import React from 'react';
import { cn } from '@bcsdlab/utils';
import { DeptListResponse } from 'api/dept/entity';
import DownArrowIcon from 'assets/svg/down-arrow-icon.svg';
import CurriculumIcon from 'assets/svg/curriculum-icon.svg';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './Curriculum.module.scss';

export interface CurriculumListBoxProps {
  list: DeptListResponse;
}

function Curriculum({ list }: CurriculumListBoxProps) {
  const logger = useLogger();
  const [isOpenedPopup, , closePopup, triggerPopup] = useBooleanState(false);

  const handleToggleListBox = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    triggerPopup();
  };

  const onClickOption = (dept: string) => {
    logger.actionEventClick({
      actionTitle: 'USER',
      title: 'timetable',
      value: `click_currirculum_${dept}`,
    });
    closePopup();
  };

  const { containerRef } = useOutsideClick({ onOutsideClick: closePopup });

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
        <DownArrowIcon />
      </button>
      {isOpenedPopup && (
        <div className={styles['select__curriculum-list']} role="listbox">
          {list.map((dept) => (
            <a
              href={dept.curriculum_link}
              target="_blank"
              rel="noreferrer"
              onClick={() => onClickOption(dept.name)}
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
            onClick={() => onClickOption('대학요람')}
            className={styles.select__curriculum}
          >
            대학 요람
          </a>
        </div>
      )}
    </div>
  );
}

export default Curriculum;
