/* eslint-disable no-restricted-imports */
import React, { useState } from 'react';
import useBooleanState from 'utils/hooks/useBooleanState';
import TimetableSettingModal from 'pages/Timetable/components/TimetableList/TimetableSettingModal';
import { ReactComponent as AddIcon } from 'assets/svg/add-icon.svg';
import { ReactComponent as SettingIcon } from 'assets/svg/setting-icon.svg';
import SemesterListbox from 'pages/Timetable/components/SemesterList';
import useFrameList from 'pages/Timetable/hooks/useFrameList';
import { useSemester } from 'utils/zustand/semester';
import useTokenState from 'utils/hooks/useTokenState';
import { Frame } from 'api/timetable/entity';
import styles from './TimetableList.module.scss';

export default function TimetableList() {
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  /* 나의 시간표 api 만들어지면 수정될 부분 */

  const semester = useSemester();
  const token = useTokenState();
  const { data: frameList } = useFrameList(token, semester);

  const [focusFrame, setFocusFrame] = useState<Frame | null>(null);

  const handleOpenModal = (frame: Frame) => {
    setFocusFrame(frame);
    openModal();
  };

  return (
    <div className={styles['timetable-list']}>
      <SemesterListbox />
      <ul className={styles['timetable-list__list']} role="listbox">
        {frameList?.map((frame) => (
          <div className={styles['timetable-list__list--item']} key={frame.id}>
            <li>{frame.timetable_name}</li>
            <button
              type="button"
              className={styles['timetable-list__list--setting']}
              onClick={() => handleOpenModal(frame)}
            >
              <SettingIcon />
              설정
            </button>
          </div>
        ))}
        <button type="button" className={styles['timetable-list__list--add']}>
          <div>시간표 추가하기</div>
          <AddIcon />
        </button>
      </ul>
      {isModalOpen && (
      <TimetableSettingModal
        focusFrame={focusFrame!!}
        setFocusFrame={setFocusFrame}
        onClose={closeModal}
      />
      )}
    </div>
  );
}
