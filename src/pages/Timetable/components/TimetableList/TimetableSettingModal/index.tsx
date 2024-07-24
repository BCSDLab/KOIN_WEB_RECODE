import React from 'react';
import { cn } from '@bcsdlab/utils';
import { ReactComponent as CloseIcon } from 'assets/svg/close-icon-black.svg';
import { ReactComponent as CheckedIcon } from 'assets/svg/checked-icon.svg';
import { ReactComponent as NotCheckedIcon } from 'assets/svg/not-checked-icon.svg';
import { TimetableFrameInfo } from 'api/timetable/entity';
import useUpdateTimetableFrame from 'pages/Timetable/hooks/useUpdateTimetableFrame';
import useDeleteTimetableFrame from 'pages/Timetable/hooks/useDeleteTimetableFrame';
import useTokenState from 'utils/hooks/useTokenState';
import { useSemester } from 'utils/zustand/semester';
import styles from './TimetableSettingModal.module.scss';

export interface TimetableSettingModalProps {
  focusFrame: TimetableFrameInfo
  setFocusFrame: (frame: TimetableFrameInfo) => void
  onClose: () => void
}

export default function TimetableSettingModal({
  focusFrame,
  setFocusFrame,
  onClose,
}: TimetableSettingModalProps) {
  const token = useTokenState();
  const semester = useSemester();
  const toggleIsChecked = () => {
    if (focusFrame.is_main) setFocusFrame({ ...focusFrame, is_main: false });
    else setFocusFrame({ ...focusFrame, is_main: true });
  };

  const { mutate: updateFrameInfo } = useUpdateTimetableFrame();

  const onSubmit = (submitFrame: TimetableFrameInfo) => {
    updateFrameInfo(submitFrame);
    onClose();
  };
  const { mutate: deleteTimetableFrame } = useDeleteTimetableFrame(token, semester);
  const onDelete = () => {
    deleteTimetableFrame(focusFrame.id);
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
            onClick={onDelete}
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
