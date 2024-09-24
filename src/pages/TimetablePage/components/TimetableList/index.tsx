/* eslint-disable no-restricted-imports */
import React from 'react';
import { cn } from '@bcsdlab/utils';
import { useSemester } from 'utils/zustand/semester';
import { TimetableFrameInfo } from 'api/timetable/entity';
import { Portal } from 'components/common/Modal/PortalProvider';
import { ReactComponent as AddIcon } from 'assets/svg/add-icon.svg';
import { ReactComponent as SettingIcon } from 'assets/svg/setting-icon.svg';
import { ReactComponent as BlueSettingIcon } from 'assets/svg/setting-icon-blue.svg';
import { ReactComponent as BookMarkIcon } from 'assets/svg/book-mark.svg';
import TimetableSettingModal from 'pages/TimetablePage/components/TimetableList/TimetableSettingModal';
import InducingLoginModal from 'pages/TimetablePage/components/InducingLoginModal';
import useTimetableFrameList from 'pages/TimetablePage/hooks/useTimetableFrameList';
import SemesterList from 'pages/TimetablePage/components/SemesterList';
import useAddTimetableFrame from 'pages/TimetablePage/hooks/useAddTimetableFrame';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useTokenState from 'utils/hooks/state/useTokenState';
import useSemesterCheck from 'pages/TimetablePage/hooks/useMySemester';
import { toast } from 'react-toastify';
import styles from './TimetableList.module.scss';

interface TimetableListProps {
  currentFrameIndex: number,
  setCurrentFrameIndex: (index: number) => void
}

// 콘골

export default function TimetableList({
  currentFrameIndex, setCurrentFrameIndex,
}: TimetableListProps) {
  const portalManager = useModalPortal();
  const semester = useSemester();
  const token = useTokenState();
  const { data } = useTimetableFrameList(token, semester);
  const { data: mySemester } = useSemesterCheck(token);
  const [focusFrame, setFocusFrame] = React.useState<TimetableFrameInfo | null>(null);
  const { mutate: addTimetableFrame } = useAddTimetableFrame(token);
  const defaultFrame = data.filter((frame) => frame.is_main);
  const timetableFrameList = data.filter((frame) => !frame.is_main);
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);

  const handleTimetableSettingClick = (frame: TimetableFrameInfo) => {
    if (token) {
      setFocusFrame(frame);
      openModal();
    } else {
      portalManager.open((portalOption: Portal) => (
        <InducingLoginModal
          actionTitle="시간표 설정"
          detailExplanation="시간표 설정은 회원만 사용 가능합니다. 회원가입 또는 로그인 후 이용해주세요 :-)"
          onClose={portalOption.close}
        />
      ));
    }
  };

  const handleAddTimetableClick = () => {
    if (token) {
      if (mySemester?.semesters.length === 0) {
        toast('학기가 존재하지 않습니다. 학기를 추가해주세요.');
      } else {
        addTimetableFrame(
          { semester: String(semester) },
          {
            onSuccess: (newTimetable) => {
              if (newTimetable && newTimetable.id) {
                setCurrentFrameIndex(newTimetable.id);
              }
            },
          },
        );
      }
    } else {
      portalManager.open((portalOption: Portal) => (
        <InducingLoginModal
          actionTitle="시간표 추가"
          detailExplanation="시간표 추가는 회원만 사용 가능합니다. 회원가입 또는 로그인 후 이용해주세요 :-)"
          onClose={portalOption.close}
        />
      ));
    }
  };

  return (
    <div className={styles['timetable-list']}>
      <SemesterList />
      <ul className={styles['timetable-list__list']} role="listbox">
        <div
          className={styles['timetable-list__list--scroll']}
          role="button"
          tabIndex={0}
        >
          {defaultFrame.map((frame) => (
            <button
              type="button"
              className={cn({
                [styles['timetable-list__item']]: true,
                [styles['timetable-list__item--selected']]:
                  currentFrameIndex === frame.id || !frame.id,
              })}
              key={frame.id}
              onClick={() => frame.id && setCurrentFrameIndex(frame.id)}
            >
              <div className={styles['timetable-list__item--title-container']}>
                <li>{frame.timetable_name}</li>
                <BookMarkIcon className={styles['timetable-list__item--bookmark-icon']} />
              </div>
              <button
                type="button"
                className={styles['timetable-list__item--setting']}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTimetableSettingClick(frame);
                }}
              >
                {currentFrameIndex === frame.id || !frame.id
                  ? <BlueSettingIcon />
                  : <SettingIcon />}
                설정
              </button>
            </button>
          ))}
          {timetableFrameList?.map((frame) => (
            <button
              type="button"
              className={cn({
                [styles['timetable-list__item']]: true,
                [styles['timetable-list__item--selected']]:
                  currentFrameIndex === frame.id || !frame.id,
              })}
              key={frame.id}
              onClick={() => frame.id && setCurrentFrameIndex(frame.id)}
            >
              <li>{frame.timetable_name}</li>
              <button
                type="button"
                className={styles['timetable-list__item--setting']}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTimetableSettingClick(frame);
                }}
              >
                {currentFrameIndex === frame.id || !frame.id ? (
                  <BlueSettingIcon />
                ) : (
                  <SettingIcon />
                )}
                설정
              </button>
            </button>
          ))}
        </div>
        <button
          type="button"
          className={styles['timetable-list__list--add']}
          onClick={handleAddTimetableClick}
        >
          시간표 추가하기
          <AddIcon />
        </button>
      </ul>
      {isModalOpen && (
        <TimetableSettingModal focusFrame={focusFrame!} onClose={closeModal} />
      )}
    </div>
  );
}
