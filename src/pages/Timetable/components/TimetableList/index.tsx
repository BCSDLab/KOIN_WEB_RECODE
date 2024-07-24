/* eslint-disable no-restricted-imports */
import React from 'react';
import useBooleanState from 'utils/hooks/useBooleanState';
import TimetableSettingModal from 'pages/Timetable/components/TimetableList/TimetableSettingModal';
import { ReactComponent as AddIcon } from 'assets/svg/add-icon.svg';
import { ReactComponent as SettingIcon } from 'assets/svg/setting-icon.svg';
import SemesterListbox from 'pages/Timetable/components/SemesterList';
import { useSemester } from 'utils/zustand/semester';
import useTokenState from 'utils/hooks/useTokenState';
import useTimetableFrameList from 'pages/Timetable/hooks/useTimetableFrameList';
import { TimetableFrameInfo } from 'api/timetable/entity';
import useAddTimetableFrame from 'pages/Timetable/hooks/useAddTimetableFrame';
import styles from './TimetableList.module.scss';

export default function TimetableList() {
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const semester = useSemester();
  const token = useTokenState();
  const { data: timetableFrameList } = useTimetableFrameList(token, semester);
  const [focusFrame, setFocusFrame] = React.useState<TimetableFrameInfo | null>(null);
  const { mutate: addTimetableFrame } = useAddTimetableFrame(token);
  const handleOpenModal = (frame: TimetableFrameInfo) => {
    setFocusFrame(frame);
    openModal();
  };

  return (
    <div className={styles['timetable-list']}>
      <SemesterListbox />
      <ul className={styles['timetable-list__list']} role="listbox">
        {timetableFrameList?.map((frame) => (
          <div className={styles['timetable-list__list--item']} key={frame.id}>
            <li>
              {frame.timetable_name}
            </li>
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
        <button
          type="button"
          className={styles['timetable-list__list--add']}
          onClick={() => addTimetableFrame({ semester: String(semester) })}
        >
          시간표 추가하기
          <AddIcon />
        </button>
      </ul>
      {isModalOpen && (
        <TimetableSettingModal
          focusFrame={focusFrame!}
          setFocusFrame={setFocusFrame}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
