import React, { useState } from 'react';

import type { Semester, TimetableFrameInfo } from 'api/timetable/entity';
import CheckedIcon from 'assets/svg/timetable-checkbox-checked.svg';
import UncheckedIcon from 'assets/svg/timetable-checkbox-unchecked.svg';
import useUpdateTimetableFrame from 'components/TimetablePage/hooks/useUpdateTimetableFrame';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';

import styles from './TimetableModal.module.scss';

interface TimetableSettingModalProps {
  semester: Semester;
  frame: TimetableFrameInfo;
  onClose: () => void;
  onRequestDelete: () => void;
}

export default function TimetableSettingModal({
  semester,
  frame,
  onClose,
  onRequestDelete,
}: TimetableSettingModalProps) {
  const { backgroundRef } = useOutsideClick({ onOutsideClick: onClose });
  const { mutate: updateFrame } = useUpdateTimetableFrame(semester);
  const [name, setName] = useState(frame.name);
  const [isMain, setIsMain] = useState(frame.is_main);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateFrame({ ...frame, name, is_main: isMain });
    onClose();
  };

  return (
    <div className={styles.background} ref={backgroundRef}>
      <form className={`${styles.container} ${styles['container--setting']}`} onSubmit={handleSubmit}>
        <h2 className={styles.title}>시간표 설정</h2>
        <input
          className={styles.name}
          value={name}
          aria-label="시간표 이름"
          onChange={(e) => setName(e.target.value)}
        />
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            className={styles.checkbox__input}
            checked={isMain}
            disabled={frame.is_main}
            onChange={(e) => setIsMain(e.target.checked)}
          />
          {isMain ? <CheckedIcon /> : <UncheckedIcon />}
          기본 시간표로 설정하기
        </label>
        <div className={styles.buttons}>
          <button type="button" className={`${styles.button} ${styles['button--outline']}`} onClick={onRequestDelete}>
            삭제
          </button>
          <button type="submit" className={`${styles.button} ${styles['button--primary']}`}>
            저장
          </button>
        </div>
      </form>
    </div>
  );
}
