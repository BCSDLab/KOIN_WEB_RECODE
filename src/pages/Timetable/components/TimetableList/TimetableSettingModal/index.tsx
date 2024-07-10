import React from 'react';
import { cn } from '@bcsdlab/utils';
import { ReactComponent as CloseIcon } from 'assets/svg/close-icon-black.svg';
import { ReactComponent as CheckedIcon } from 'assets/svg/checked-icon.svg';
import { ReactComponent as NotCheckedIcon } from 'assets/svg/not-checked-icon.svg';
import { Frame } from 'api/timetable/entity';
// import useTokenState from 'utils/hooks/useTokenState';
// import useUpdate from 'pages/Timetable/hooks/useUpdateFtame';
import styles from './TimetableSettingModal.module.scss';

export interface TimetableSettingModalProps {
  focusFrame: Frame
  setFocusFrame: (frame: Frame) => void
  onClose: () => void
}

export default function TimetableSettingModal({
  onClose,
  focusFrame,
  setFocusFrame,
}: TimetableSettingModalProps) {
  const toggleIsChecked = () => {
    if (focusFrame.is_main) setFocusFrame({ ...focusFrame, is_main: false });
    else setFocusFrame({ ...focusFrame, is_main: true });
  };

  // const { mutate: updateFrameInfo } = useUpdate();

  const onSubmit = (submitFrame:Frame) => {
    console.log('submit', submitFrame);
    // updateFrameInfo(submitFrame);
    onClose();
  };
  return (
    <div className={styles.background} aria-hidden>
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
            placeholder={focusFrame.timetable_name}
            className={cn({
              [styles['container__timetable-name']]: true,
            })}
            onChange={(e) => setFocusFrame({ ...focusFrame, timetable_name: e.target.value })}
          />
        </div>
        <div className={styles['container__setting-message']}>
          <button type="button" className={styles.container__checkbox} onClick={toggleIsChecked}>
            {focusFrame.is_main ? <CheckedIcon /> : <NotCheckedIcon />}
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
            onClick={() => onSubmit(focusFrame)}
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
