import React from 'react';
import { cn } from '@bcsdlab/utils';
import { ReactComponent as CloseIcon } from 'assets/svg/close-icon-black.svg';
import { ReactComponent as CheckedIcon } from 'assets/svg/checked-icon.svg';
import { ReactComponent as NotCheckedIcon } from 'assets/svg/not-checked-icon.svg';
import { TimetableFrameInfo } from 'api/timetable/entity';
import useUpdateTimetableFrame from 'pages/TimetablePage/hooks/useUpdateTimetableFrame';
import useDeleteTimetableFrame from 'pages/TimetablePage/hooks/useDeleteTimetableFrame';
import { useSemester } from 'utils/zustand/semester';
import useToast from 'components/common/Toast/useToast';
import showToast from 'utils/ts/showToast';
import useTokenState from 'utils/hooks/state/useTokenState';
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
  const toast = useToast();
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
  const recoverFrame = () => {
    // TODO: v2/timetables/lecture api 연결 후 시간표 프레임 추가와 강의 정보 추가로 recover 구현 예정.
  };
  const { mutate: deleteTimetableFrame } = useDeleteTimetableFrame(
    token,
    semester,
  );
  const onDelete = (frame: TimetableFrameInfo) => {
    if (!focusFrame.id) {
      showToast('warning', '로그인 후 이용 가능합니다.');
      return;
    }
    toast.open({
      message: `선택하신 [${frame.timetable_name}]이 삭제되었습니다.`,
      recoverMessage: `[${frame.timetable_name}]이 복구되었습니다.`,
      onRecover: recoverFrame,
    });
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
          <button
            id="default-checkbox"
            type="button"
            className={styles.container__checkbox}
            onClick={toggleIsChecked}
          >
            {focusFrame.is_main ? <CheckedIcon /> : <NotCheckedIcon />}
          </button>
          <label
            htmlFor="default-checkbox"
            className={styles['container__set-default-timetable']}
          >
            기본 시간표로 설정하기
          </label>
        </div>
        <div className={styles.container__button}>
          <button
            type="button"
            className={cn({
              [styles['container__button--delete']]: true,
            })}
            onClick={() => onDelete(focusFrame)}
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
