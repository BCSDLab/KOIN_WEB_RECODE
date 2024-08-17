/* eslint-disable no-restricted-imports */
import React from 'react';
import useBooleanState from 'utils/hooks/useBooleanState';
import TimetableSettingModal from 'pages/Timetable/components/TimetableList/TimetableSettingModal';
import { ReactComponent as AddIcon } from 'assets/svg/add-icon.svg';
import { ReactComponent as SettingIcon } from 'assets/svg/setting-icon.svg';
import { ReactComponent as BlueSettingIcon } from 'assets/svg/setting-icon-blue.svg';
import SemesterListbox from 'pages/Timetable/components/SemesterList';
import { useSemester } from 'utils/zustand/semester';
import useTokenState from 'utils/hooks/useTokenState';
import useTimetableFrameList from 'pages/Timetable/hooks/useTimetableFrameList';
import { TimetableFrameInfo } from 'api/timetable/entity';
import useAddTimetableFrame from 'pages/Timetable/hooks/useAddTimetableFrame';
import { cn } from '@bcsdlab/utils';
import styles from './TimetableList.module.scss';

export default function TimetableList() {
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const semester = useSemester();
  const token = useTokenState();
  const { data: timetableFrameList } = useTimetableFrameList(token, semester);
  const [focusFrame, setFocusFrame] = React.useState<TimetableFrameInfo | null>(null);
  const { mutate: addTimetableFrame } = useAddTimetableFrame(token);
  const [currentFrameIndex, setCurrentFrameIndex] = React.useState(0);
  const selectFrame = (index: number) => {
    setCurrentFrameIndex(index);
  };
  const handleOpenModal = (frame: TimetableFrameInfo) => {
    setFocusFrame(frame);
    openModal();
  };

  React.useEffect(() => {
    if (timetableFrameList) {
      const mainFrame = timetableFrameList.find((frame) => frame.is_main === true);
      if (mainFrame) {
        setCurrentFrameIndex(mainFrame.id);
      }
    }
  }, [timetableFrameList]);

  return (
    <div className={styles['timetable-list']}>
      <SemesterListbox />
      <ul className={styles['timetable-list__list']} role="listbox">
        <div className={styles['timetable-list__list--scroll']} role="button" tabIndex={0}>
          {timetableFrameList?.map((frame) => (
            <button
              type="button"
              className={cn({
                [styles['timetable-list__item']]: true,
                [styles['timetable-list__item--selected']]: currentFrameIndex === frame.id,
              })}
              key={frame.id}
              onClick={() => selectFrame(frame.id)}
            >
              <li>
                {frame.timetable_name}
              </li>
              <button
                type="button"
                className={styles['timetable-list__item--setting']}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenModal(frame);
                }}
              >
                {currentFrameIndex === frame.id ? <BlueSettingIcon /> : <SettingIcon />}
                설정
              </button>
            </button>
          ))}
        </div>
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
