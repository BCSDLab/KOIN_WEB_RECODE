import React from 'react';
import { cn } from '@bcsdlab/utils';
import { ReactComponent as CloseIcon } from 'assets/svg/close-icon-black.svg';
import { ReactComponent as CheckedIcon } from 'assets/svg/checked-icon.svg';
import { ReactComponent as NotCheckedIcon } from 'assets/svg/not-checked-icon.svg';
import { TimetableFrameInfo } from 'api/timetable/entity';
import useUpdateTimetableFrame from 'pages/TimetablePage/hooks/useUpdateTimetableFrame';
import useDeleteTimetableFrame from 'pages/TimetablePage/hooks/useDeleteTimetableFrame';
import { useSemester } from 'utils/zustand/semester';
import showToast from 'utils/ts/showToast';
import useTokenState from 'utils/hooks/state/useTokenState';
import useMyLecturesV2 from 'pages/TimetablePage/hooks/useMyLecturesV2';
import styles from './TimetableSettingModal.module.scss';

export interface TimetableSettingModalProps {
  focusFrame: TimetableFrameInfo;
  setFocusFrame: (frame: TimetableFrameInfo) => void;
  onClose: () => void;
}

export default function TimetableSettingModal({
  focusFrame,
  setFocusFrame,
  onClose,
}: TimetableSettingModalProps) {
  const token = useTokenState();
  const semester = useSemester();
  const myLectures = useMyLecturesV2(focusFrame.id!);
  const toggleIsChecked = () => {
    if (focusFrame.is_main) setFocusFrame({ ...focusFrame, is_main: false });
    else setFocusFrame({ ...focusFrame, is_main: true });
  };

  const { mutate: updateFrameInfo } = useUpdateTimetableFrame();

  const onSubmit = (submitFrame: TimetableFrameInfo) => {
    if (!submitFrame.id) {
      showToast('warning', '로그인 후 이용 가능합니다.');
      return;
    }
    updateFrameInfo(submitFrame);
    onClose();
  };

  const { mutate: deleteTimetableFrame } = useDeleteTimetableFrame(token, semester);
  const onDelete = () => {
    if (!focusFrame.id) {
      showToast('warning', '로그인 후 이용 가능합니다.');
      return;
    }
    sessionStorage.setItem('restoreLecturesInFrame', JSON.stringify(myLectures));
    deleteTimetableFrame({ id: focusFrame.id, frame: focusFrame });
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
        {focusFrame.is_main ? (
          <div className={styles['container__set-default-timetable-message']}>
            기본 시간표로 설정되었습니다.
          </div>
        ) : (
          <div className={styles['container__setting-message']}>
            <button
              id="default_timetable"
              type="button"
              className={styles.container__checkbox}
              onClick={toggleIsChecked}
            >
              {focusFrame.is_main ? <CheckedIcon /> : <NotCheckedIcon />}
            </button>
            <label
              htmlFor="default_timetable"
              className={styles['container__set-default-timetable']}
            >
              기본 시간표로 설정하기
            </label>
          </div>
        )}
        <div className={styles.container__button}>
          <button
            type="button"
            className={cn({
              [styles['container__button--delete']]: true,
            })}
            onClick={() => onDelete()}
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
