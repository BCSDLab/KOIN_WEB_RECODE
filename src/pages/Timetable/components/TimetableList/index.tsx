/* eslint-disable no-restricted-imports */
import React from 'react';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import TimetableSettingModal from 'pages/Timetable/components/TimetableList/TimetableSettingModal';
import { ReactComponent as AddIcon } from 'assets/svg/add-icon.svg';
import { ReactComponent as SettingIcon } from 'assets/svg/setting-icon.svg';
import SemesterListbox from 'pages/Timetable/components/SemesterList';
import styles from './TimetableList.module.scss';

export default function TimetableList() {
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  /* 나의 시간표 api 만들어지면 수정될 부분 */
  const timetableList = ['1안', '2안', '3안'];

  return (
    <div className={styles['timetable-list']}>
      <SemesterListbox />
      <ul className={styles['timetable-list__list']} role="listbox">
        {timetableList.map((value) => (
          <div className={styles['timetable-list__list--item']} key={value}>
            <li>
              {value}
            </li>
            <button type="button" className={styles['timetable-list__list--setting']} onClick={openModal}>
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
          onClose={closeModal}
        />
      )}
    </div>
  );
}
