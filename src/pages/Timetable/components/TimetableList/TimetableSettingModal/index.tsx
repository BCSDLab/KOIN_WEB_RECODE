import React from 'react';
import { cn } from '@bcsdlab/utils';
import { ReactComponent as CloseIcon } from 'assets/svg/close-icon-black.svg';
import { ReactComponent as CheckedIcon } from 'assets/svg/checked-icon.svg';
import { ReactComponent as NotCheckedIcon } from 'assets/svg/not-checked-icon.svg';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { useEscapeKey } from 'utils/hooks/ui/useEscapeKey';
import styles from './TimetableSettingModal.module.scss';

export interface TimetableSettingModalProps {
  onClose: () => void
}

export default function TimetableSettingModal({
  onClose,
}: TimetableSettingModalProps) {
  const [isChecked, setIsChecked] = React.useState(false);
  const { backgroundRef } = useOutsideClick({ onOutsideClick: onClose });
  useEscapeKey({ onEscape: onClose });

  const toggleIsChecked = () => {
    if (isChecked) setIsChecked(false);
    else setIsChecked(true);
  };

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.container}>
        <header className={styles.container__header}>
          <span className={styles.container__title}>시간표 설정</span>
          <CloseIcon
            className={styles['container__close-button']}
            onClick={onClose}
          />
        </header>
        <div className={styles.container__input}>
          <input
            placeholder="시간표 이름"
            className={cn({
              [styles['container__timetable-name']]: true,
            })}
          />
        </div>
        <div className={styles['container__setting-message']}>
          <button type="button" className={styles.container__checkbox} onClick={toggleIsChecked}>
            {isChecked ? <CheckedIcon /> : <NotCheckedIcon />}
          </button>
          <div className={styles['container__set-default-timetable']}>기본 시간표로 설정하기</div>
        </div>
        <div className={styles.container__button}>
          <button
            type="button"
            className={cn({
              [styles['container__button--delete']]: true,
            })}
            onClick={onClose}
          >
            삭제하기
          </button>
          <button
            type="button"
            className={cn({
              [styles['container__button--save']]: true,
            })}
            onClick={onClose}
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
